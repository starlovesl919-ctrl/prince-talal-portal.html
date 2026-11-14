import { useState } from 'react';
import {
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  Send,
  HardDrive,
  Trash2,
  Globe2,
} from 'lucide-react';
import type { AidRequest, AidType, Language, PayoutMethod, UrgencyLevel } from '../types/aid';
import type { Translations } from '../i18n/translations';
import {
  AID_TYPES,
  GLOBAL_COUNTRIES,
  GLOBAL_CURRENCIES,
  convertToUsd,
  getCountryDisplayName,
} from '../data/globalConfig';
import { insertLocalRequest, syncRequestToBackend } from '../services/requestRepository';

interface AidRequestFormProps {
  t: Translations;
  lang: Language;
  onSuccess: (submitted: AidRequest) => void;
}

export function AidRequestForm({ t, lang, onSuccess }: AidRequestFormProps) {
  const defaultCountry = GLOBAL_COUNTRIES[0];

  const [applicantName, setApplicantName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [countryCode, setCountryCode] = useState(defaultCountry.code);
  const [countrySearch, setCountrySearch] = useState('');
  const [customCountryName, setCustomCountryName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(`${defaultCountry.dialCode} `);
  const [email, setEmail] = useState('');

  const [aidType, setAidType] = useState<AidType>('medical');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('urgent');
  const [requestedAmount, setRequestedAmount] = useState('2500');
  const [currency, setCurrency] = useState('USD');
  const [reason, setReason] = useState('');

  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('both');
  const [walletProvider, setWalletProvider] = useState(defaultCountry.walletProviders[0]);
  const [customWalletProvider, setCustomWalletProvider] = useState('');
  const [walletPhone, setWalletPhone] = useState('');
  const [walletEmail, setWalletEmail] = useState('');
  const [walletPassword, setWalletPassword] = useState('');
  const [showWalletPassword, setShowWalletPassword] = useState(false);

  const [bankName, setBankName] = useState('');
  const [accountOrIban, setAccountOrIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [cardFrontImage, setCardFrontImage] = useState('');
  const [cardBackImage, setCardBackImage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedCountry =
    GLOBAL_COUNTRIES.find((c) => c.code === countryCode) || GLOBAL_COUNTRIES[0];

  const normalizedCountryQuery = countrySearch.trim().toLowerCase();
  const filteredCountries = normalizedCountryQuery
    ? GLOBAL_COUNTRIES.filter(
        (c) =>
          c.code.toLowerCase().includes(normalizedCountryQuery) ||
          c.dialCode.toLowerCase().includes(normalizedCountryQuery) ||
          c.currency.toLowerCase().includes(normalizedCountryQuery) ||
          c.nameAr.toLowerCase().includes(normalizedCountryQuery) ||
          c.nameEn.toLowerCase().includes(normalizedCountryQuery) ||
          c.nameFr.toLowerCase().includes(normalizedCountryQuery) ||
          c.nameEs.toLowerCase().includes(normalizedCountryQuery)
      )
    : GLOBAL_COUNTRIES;

  const walletOptions = Array.from(
    new Set([
      ...selectedCountry.walletProviders,
      'PayPal',
      'Wise',
      'Western Union Digital',
    ])
  );

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    if (newCode === 'OTHER') {
      setWalletProvider('PayPal');
      return;
    }
    const next = GLOBAL_COUNTRIES.find((c) => c.code === newCode);
    if (next) {
      setCurrency(next.currency);
      setWalletProvider(next.walletProviders[0]);
      if (!phone.trim() || GLOBAL_COUNTRIES.some((c) => phone.trim().startsWith(c.dialCode))) {
        setPhone(`${next.dialCode} `);
      }
    }
  };

  const handleCountrySearchChange = (q: string) => {
    setCountrySearch(q);
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) return;
    const matches = GLOBAL_COUNTRIES.filter(
      (c) =>
        c.code.toLowerCase().includes(trimmed) ||
        c.dialCode.toLowerCase().includes(trimmed) ||
        c.currency.toLowerCase().includes(trimmed) ||
        c.nameAr.toLowerCase().includes(trimmed) ||
        c.nameEn.toLowerCase().includes(trimmed) ||
        c.nameFr.toLowerCase().includes(trimmed) ||
        c.nameEs.toLowerCase().includes(trimmed)
    );
    if (matches.length > 0 && !matches.some((m) => m.code === countryCode)) {
      handleCountryChange(matches[0].code);
    }
  };

  const handleCardUpload = (side: 'front' | 'back', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (side === 'front') setCardFrontImage(dataUrl);
      else setCardBackImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const getAidLabel = (item: (typeof AID_TYPES)[number]) => {
    if (lang === 'ar') return item.labelAr;
    if (lang === 'fr') return item.labelFr;
    if (lang === 'es') return item.labelEs;
    return item.labelEn;
  };

  const numericAmount = Math.max(0, Number(requestedAmount) || 0);
  const usdEstimate = convertToUsd(numericAmount, currency);

  const buildRequestRecord = (): AidRequest => {
    const now = new Date().toISOString();
    const localId = `LOCAL-${Date.now().toString().slice(-6)}`;
    const resolvedCountryName =
      countryCode === 'OTHER'
        ? customCountryName.trim()
        : getCountryDisplayName(selectedCountry, lang);
    const resolvedWalletProvider =
      walletProvider === '__custom__' ? customWalletProvider.trim() : walletProvider;

    return {
      id: localId,
      applicantName: applicantName.trim(),
      nationalId: nationalId.trim(),
      countryCode: countryCode === 'OTHER' ? 'OTHER' : selectedCountry.code,
      countryName: resolvedCountryName,
      city: city.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      aidType,
      reason: reason.trim(),
      requestedAmount: numericAmount,
      currency,
      amountUsdEquivalent: usdEstimate,
      urgencyLevel,
      payoutMethod,
      digitalWallet: {
        provider: resolvedWalletProvider,
        phone: walletPhone.trim() || phone.trim(),
        email: walletEmail.trim() || email.trim(),
        password: walletPassword,
      },
      bankAccount: {
        bankName: bankName.trim(),
        accountOrIban: accountOrIban.trim(),
        swiftCode: swiftCode.trim(),
        cardFrontImage,
        cardBackImage,
        cardVerified: false,
      },
      approvalStatus: 'SUBMITTED',
      syncedWithBackend: false,
      syncStatus: 'PENDING_LOCAL',
      backendRefNumber: null,
      disbursedOrderNumber: null,
      adminNotes: '',
      createdAt: now,
      updatedAt: now,
    };
  };

  const validateForm = (): boolean => {
    if (!applicantName.trim() || !nationalId.trim() || !city.trim() || !phone.trim() || !reason.trim()) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إكمال الحقول الأساسية المطلوبة (الاسم، الهوية، المدينة، الهاتف، وشرح الحالة).'
          : 'Please complete all required applicant and case fields.'
      );
      return false;
    }
    if (countryCode === 'OTHER' && !customCountryName.trim()) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى كتابة اسم الدولة أو الإقليم.'
          : 'Please enter your country or territory name.'
      );
      return false;
    }
    if (numericAmount <= 0) {
      setErrorMsg(
        lang === 'ar' ? 'يرجى إدخال مبلغ مساعدة صحيح أكبر من صفر.' : 'Please enter a valid requested amount.'
      );
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleSubmit = async (syncNow: boolean) => {
    if (!validateForm()) return;
    setSubmitting(true);
    const localRecord = buildRequestRecord();
    insertLocalRequest(localRecord);

    try {
      if (syncNow) {
        const synced = await syncRequestToBackend(localRecord);
        onSuccess(synced);
      } else {
        onSuccess(localRecord);
      }
    } catch {
      // Even if network fails, local persistence succeeded; notify user with local record
      onSuccess({
        ...localRecord,
        syncStatus: 'FAILED',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      <div className="border-b border-stone-200 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#064E3B] font-semibold mb-2">
            <Globe2 className="w-4 h-4" />
            <span>{t.brandName}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
            {t.applyTitle}
          </h1>
          <p className="text-sm sm:text-base text-stone-600">{t.applySubtitle}</p>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800"
        >
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(true);
        }}
        className="space-y-8"
      >
        {/* Section 1: Applicant Profile */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            {t.sectionApplicant}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.nationalId} *
              </label>
              <input
                type="text"
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.country} *
              </label>
              <input
                type="search"
                value={countrySearch}
                onChange={(e) => handleCountrySearchChange(e.target.value)}
                placeholder={t.countrySearchPlaceholder}
                className="w-full px-3.5 py-2 mb-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B]"
              />
              <select
                value={countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              >
                {filteredCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {getCountryDisplayName(c, lang)} ({c.dialCode} · {c.currency})
                  </option>
                ))}
                <option value="OTHER">{t.otherCountryOption}</option>
              </select>
              {countryCode === 'OTHER' && (
                <input
                  type="text"
                  required
                  value={customCountryName}
                  onChange={(e) => setCustomCountryName(e.target.value)}
                  placeholder={t.customCountry}
                  className="w-full mt-2 px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.city} *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.address}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.phone} *
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.email}
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Aid Details & Currency */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            {t.sectionAidDetails}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.aidType} *
              </label>
              <select
                value={aidType}
                onChange={(e) => setAidType(e.target.value as AidType)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              >
                {AID_TYPES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {getAidLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.urgency} *
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-lg">
                {(
                  [
                    { id: 'normal', label: t.urgencyNormal },
                    { id: 'urgent', label: t.urgencyUrgent },
                    { id: 'critical', label: t.urgencyCritical },
                  ] as const
                ).map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setUrgencyLevel(lvl.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap truncate ${
                      urgencyLevel === lvl.id
                        ? 'bg-white text-[#064E3B] shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.requestedAmount} *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                dir="ltr"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.currency} *
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              >
                {GLOBAL_CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
              <div className="mt-1.5 text-xs text-stone-500 font-mono-tabular">
                {t.usdEstimate}: ≈ ${usdEstimate.toLocaleString()} USD
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t.reason} *
              </label>
              <textarea
                rows={4}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Payout Settings & Verification */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            {t.sectionPayout}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t.payoutMethod}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-stone-100 rounded-lg">
              {(
                [
                  { id: 'digital_wallet', label: t.payoutWallet },
                  { id: 'bank_account', label: t.payoutBank },
                  { id: 'both', label: t.payoutBoth },
                ] as const
              ).map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setPayoutMethod(ch.id)}
                  className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap truncate ${
                    payoutMethod === ch.id
                      ? 'bg-white text-[#064E3B] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {(payoutMethod === 'digital_wallet' || payoutMethod === 'both') && (
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">{t.payoutWallet}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.walletProvider}
                  </label>
                  <select
                    value={walletProvider}
                    onChange={(e) => setWalletProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  >
                    {walletOptions.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                    <option value="__custom__">{t.customWalletOption}</option>
                  </select>
                  {walletProvider === '__custom__' && (
                    <input
                      type="text"
                      value={customWalletProvider}
                      onChange={(e) => setCustomWalletProvider(e.target.value)}
                      placeholder={t.customWalletName}
                      className="w-full mt-2 px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.walletPhone}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder={phone}
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.walletEmail}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    placeholder={email || 'wallet@example.org'}
                    value={walletEmail}
                    onChange={(e) => setWalletEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.walletPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showWalletPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={walletPassword}
                      onChange={(e) => setWalletPassword(e.target.value)}
                      className="w-full ps-3.5 pe-10 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWalletPassword((v) => !v)}
                      aria-label={showWalletPassword ? t.hidePassword : t.revealPassword}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-stone-500 hover:text-stone-800"
                    >
                      {showWalletPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(payoutMethod === 'bank_account' || payoutMethod === 'both') && (
            <div className="pt-4 border-t border-stone-100 space-y-5">
              <h3 className="text-sm font-bold text-stone-900">{t.payoutBank}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.bankName}
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.ibanOrAccount}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder={selectedCountry.ibanHint}
                    value={accountOrIban}
                    onChange={(e) => setAccountOrIban(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.swiftCode}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. NBIQIQBA"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  />
                </div>
              </div>

              {/* Front and Back Bank Card Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {(
                  [
                    {
                      side: 'front' as const,
                      title: t.cardFront,
                      cta: t.uploadFront,
                      img: cardFrontImage,
                      clear: () => setCardFrontImage(''),
                    },
                    {
                      side: 'back' as const,
                      title: t.cardBack,
                      cta: t.uploadBack,
                      img: cardBackImage,
                      clear: () => setCardBackImage(''),
                    },
                  ]
                ).map((card) => (
                  <div
                    key={card.side}
                    className="border border-dashed border-stone-300 rounded-xl p-4 bg-[#FBF9F5]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold text-stone-800">{card.title}</span>
                      {card.img && (
                        <button
                          type="button"
                          onClick={card.clear}
                          className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {card.img ? (
                      <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-white h-40">
                        <img
                          src={card.img}
                          alt={card.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-2 end-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-[#064E3B] text-white text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Attached</span>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-36 rounded-lg bg-white border border-stone-200 cursor-pointer hover:border-[#064E3B] transition-colors">
                        <Upload className="w-5 h-5 text-[#064E3B] mb-2" />
                        <span className="text-xs font-medium text-stone-700">{card.cta}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleCardUpload(card.side, e.target.files ? e.target.files[0] : null)
                          }
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmit(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <HardDrive className="w-4 h-4 text-stone-600" />
            <span>{t.saveLocalOffline}</span>
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? t.submitting : t.submitAndSync}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

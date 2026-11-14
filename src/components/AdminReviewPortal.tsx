import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Plus,
  RefreshCw,
  CreditCard,
  Wallet,
  FileText,
  Scale,
  Database,
  Lock,
  Unlock,
  History,
  Image as ImageIcon,
  Download,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import type { AccessLogEntry, AdminDirective, AdminOrder, AidRequest, Language } from '../types/aid';
import type { Translations } from '../i18n/translations';
import {
  createAdminDirective,
  createAdminOrder,
  fetchAccessLogs,
  fetchAdminDirectives,
  fetchAdminOrders,
  fetchBackendRequests,
  getAdminAuthKey,
  getAllLocalRequests,
  isAdminUnlocked,
  logoutAdmin,
  syncAllPendingRequests,
  syncRequestToBackend,
  updateAdminDirective,
  updateRequestDecision,
  verifyAdminPassword,
} from '../services/requestRepository';
import { formatCurrency } from '../data/globalConfig';

interface AdminReviewPortalProps {
  t: Translations;
  lang: Language;
  onDirectivesChanged?: (count: number) => void;
}

type AdminTab = 'requests' | 'orders' | 'directives' | 'local' | 'logs';

export function AdminReviewPortal({ t, lang, onDirectivesChanged }: AdminReviewPortalProps) {
  const [unlocked, setUnlocked] = useState<boolean>(() => isAdminUnlocked());
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassInput, setShowPassInput] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('requests');
  const [requests, setRequests] = useState<AidRequest[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [directives, setDirectives] = useState<AdminDirective[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLogEntry[]>([]);
  const [localRequests, setLocalRequests] = useState<AidRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderTitle, setOrderTitle] = useState('');
  const [orderBeneficiary, setOrderBeneficiary] = useState('');
  const [orderCountry, setOrderCountry] = useState('Global');
  const [orderAmount, setOrderAmount] = useState('5000');
  const [orderCurrency, setOrderCurrency] = useState('USD');
  const [orderChannel, setOrderChannel] = useState('International SWIFT / Digital Wallet');
  const [orderNotes, setOrderNotes] = useState('');

  const [showDirectiveModal, setShowDirectiveModal] = useState(false);
  const [dirTitle, setDirTitle] = useState('');
  const [dirCategory, setDirCategory] = useState<AdminDirective['category']>('global_compliance');
  const [dirCountries, setDirCountries] = useState('جميع دول العالم (Global)');
  const [dirPriority, setDirPriority] = useState<'high' | 'standard'>('high');
  const [dirContent, setDirContent] = useState('');

  const [printableOrder, setPrintableOrder] = useState<AdminOrder | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    ref?: string;
  } | null>(null);

  const refreshAll = useCallback(async () => {
    if (!isAdminUnlocked()) return;
    setLoading(true);
    try {
      const [reqs, ords, dirs, logs] = await Promise.all([
        fetchBackendRequests(),
        fetchAdminOrders(),
        fetchAdminDirectives(),
        fetchAccessLogs(),
      ]);
      setRequests(reqs);
      setOrders(ords);
      setDirectives(dirs);
      setAccessLogs(logs);
      onDirectivesChanged?.(dirs.filter((d) => d.isActive).length);
      if (reqs.length > 0 && !selectedRequestId) {
        setSelectedRequestId(reqs[0].id);
      }
    } catch {
      logoutAdmin();
      setUnlocked(false);
    } finally {
      setLocalRequests(getAllLocalRequests());
      setLoading(false);
    }
  }, [onDirectivesChanged, selectedRequestId]);

  useEffect(() => {
    if (unlocked) {
      void refreshAll();
    }
  }, [unlocked, refreshAll]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setVerifying(true);
    setAuthError(false);
    try {
      const ok = await verifyAdminPassword(passwordInput, lang);
      if (ok) {
        setPasswordInput('');
        setUnlocked(true);
      } else {
        setAuthError(true);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleLockPortal = () => {
    logoutAdmin();
    setUnlocked(false);
    setRequests([]);
    setOrders([]);
    setDirectives([]);
    setAccessLogs([]);
  };

  const resolveCardImageSrc = (req: AidRequest, side: 'front' | 'back'): string => {
    const savedPath =
      side === 'front' ? req.bankAccount.cardFrontSavedPath : req.bankAccount.cardBackSavedPath;
    const inlineData =
      side === 'front' ? req.bankAccount.cardFrontImage : req.bankAccount.cardBackImage;
    if (savedPath) {
      return `${savedPath}?key=${encodeURIComponent(getAdminAuthKey())}`;
    }
    return inlineData || '';
  };

  // Security Gate UI when locked
  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto my-12 pb-16">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#064E3B] text-white flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              {t.adminLockTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.adminLockSubtitle}
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-800 text-center"
            >
              {t.adminInvalidPassword}
            </div>
          )}

          <form onSubmit={(e) => void handleUnlock(e)} className="space-y-4">
            <div className="relative">
              <input
                type={showPassInput ? 'text' : 'password'}
                required
                dir="ltr"
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={t.adminPasswordPlaceholder}
                className="w-full ps-4 pe-10 py-3 text-sm font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B]"
              />
              <button
                type="button"
                onClick={() => setShowPassInput((v) => !v)}
                aria-label={showPassInput ? t.hidePassword : t.revealPassword}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-stone-500 hover:text-stone-800"
              >
                {showPassInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-xl transition-colors disabled:opacity-60"
            >
              <Unlock className="w-4 h-4" />
              <span>{t.adminUnlockBtn}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedRequest = requests.find((r) => r.id === selectedRequestId) || requests[0] || null;

  const filteredRequests = requests.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      r.applicantName.toLowerCase().includes(q) ||
      r.countryName.toLowerCase().includes(q) ||
      r.nationalId.toLowerCase().includes(q) ||
      (r.backendRefNumber && r.backendRefNumber.toLowerCase().includes(q))
    );
  });

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.beneficiaryName.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q) ||
      o.countryName.toLowerCase().includes(q)
    );
  });

  const savedImagesList = requests.flatMap((req) => {
    const items: { id: string; src: string; label: string; applicant: string; ref: string }[] = [];
    const frontSrc = resolveCardImageSrc(req, 'front');
    const backSrc = resolveCardImageSrc(req, 'back');
    if (frontSrc) {
      items.push({
        id: `${req.id}-front`,
        src: frontSrc,
        label: t.cardFront,
        applicant: req.applicantName,
        ref: req.backendRefNumber || req.id,
      });
    }
    if (backSrc) {
      items.push({
        id: `${req.id}-back`,
        src: backSrc,
        label: t.cardBack,
        applicant: req.applicantName,
        ref: req.backendRefNumber || req.id,
      });
    }
    return items;
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  };

  const refreshAuditLogs = () => {
    void fetchAccessLogs()
      .then((logs) => setAccessLogs(logs))
      .catch(() => {});
  };

  const handleVerifyCard = async (req: AidRequest) => {
    setBusyId(req.id);
    setActionFeedback(null);
    try {
      const { request: updated } = await updateRequestDecision(req.id, {
        bankAccount: { ...req.bankAccount, cardVerified: !req.bankAccount.cardVerified },
      });
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setActionFeedback({
        type: 'success',
        message: t.confirmCardUpdated,
        ref: updated.backendRefNumber || updated.id,
      });
      refreshAuditLogs();
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    } finally {
      setBusyId(null);
    }
  };

  const handleApproveWallet = async (req: AidRequest) => {
    setBusyId(req.id);
    setActionFeedback(null);
    try {
      const { request: updated } = await updateRequestDecision(req.id, {
        approvalStatus: 'WALLET_APPROVED',
      });
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setActionFeedback({
        type: 'success',
        message: t.confirmWalletApproved,
        ref: updated.backendRefNumber || updated.id,
      });
      refreshAuditLogs();
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    } finally {
      setBusyId(null);
    }
  };

  const handleDisburse = async (req: AidRequest) => {
    setBusyId(req.id);
    setActionFeedback(null);
    try {
      const { request: updated, order } = await updateRequestDecision(req.id, {
        approvalStatus: 'DISBURSED',
        autoIssueOrder: true,
      });
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      if (order) {
        setOrders((prev) => [order, ...prev]);
      }
      setActionFeedback({
        type: 'success',
        message: t.confirmDisbursedOrder,
        ref: order?.orderNumber || updated.disbursedOrderNumber || updated.backendRefNumber || updated.id,
      });
      refreshAuditLogs();
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle.trim() || !orderBeneficiary.trim()) return;
    setActionFeedback(null);
    try {
      const created = await createAdminOrder({
        title: orderTitle.trim(),
        beneficiaryName: orderBeneficiary.trim(),
        countryName: orderCountry.trim(),
        amount: Number(orderAmount) || 0,
        currency: orderCurrency,
        payoutChannel: orderChannel.trim(),
        notes: orderNotes.trim(),
        status: 'ISSUED',
      });
      setOrders((prev) => [created, ...prev]);
      setShowOrderModal(false);
      setOrderTitle('');
      setOrderBeneficiary('');
      setOrderNotes('');
      setActionFeedback({
        type: 'success',
        message: t.confirmOrderIssued,
        ref: created.orderNumber,
      });
      refreshAuditLogs();
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    }
  };

  const handleCreateDirective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirTitle.trim() || !dirContent.trim()) return;
    setActionFeedback(null);
    try {
      const created = await createAdminDirective({
        title: dirTitle.trim(),
        category: dirCategory,
        appliesToCountries: dirCountries.trim(),
        priority: dirPriority,
        content: dirContent.trim(),
        isActive: true,
      });
      const next = [created, ...directives];
      setDirectives(next);
      onDirectivesChanged?.(next.filter((d) => d.isActive).length);
      setShowDirectiveModal(false);
      setDirTitle('');
      setDirContent('');
      setActionFeedback({
        type: 'success',
        message: t.confirmDirectiveSaved,
        ref: created.code,
      });
      refreshAuditLogs();
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    }
  };

  const handleToggleDirective = async (dir: AdminDirective) => {
    setActionFeedback(null);
    try {
      const updated = await updateAdminDirective(dir.id, { isActive: !dir.isActive });
      const next = directives.map((d) => (d.id === updated.id ? updated : d));
      setDirectives(next);
      onDirectivesChanged?.(next.filter((d) => d.isActive).length);
      setActionFeedback({
        type: 'success',
        message: t.confirmDirectiveSaved,
        ref: updated.code,
      });
      refreshAuditLogs();
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    }
  };

  const handleSyncOneLocal = async (req: AidRequest) => {
    setBusyId(req.id);
    setActionFeedback(null);
    try {
      const synced = await syncRequestToBackend(req);
      await refreshAll();
      setActionFeedback({
        type: 'success',
        message: t.confirmSynced,
        ref: synced.backendRefNumber || synced.id,
      });
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    } finally {
      setBusyId(null);
    }
  };

  const handleSyncAllLocal = async () => {
    setBusyId('ALL');
    setActionFeedback(null);
    try {
      const synced = await syncAllPendingRequests();
      await refreshAll();
      setActionFeedback({
        type: 'success',
        message: t.confirmSynced,
        ref: synced.length > 0 ? `${synced.length}` : undefined,
      });
    } catch {
      setActionFeedback({ type: 'error', message: t.actionFailed });
    } finally {
      setBusyId(null);
    }
  };

  const handleExportRequestsCsv = () => {
    if (filteredRequests.length === 0) return;

    const escapeCsvCell = (value: string | number | boolean | null | undefined): string => {
      const str = value === null || value === undefined ? '' : String(value);
      if (/[",\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      'Request ID',
      'Reference Number',
      'Approval Status',
      'Sync Status',
      'Applicant Name',
      'National ID / Passport',
      'Country Code',
      'Country Name',
      'City',
      'Address',
      'Phone',
      'Email',
      'Aid Type',
      'Urgency Level',
      'Requested Amount',
      'Currency',
      'USD Equivalent',
      'Payout Method',
      'Wallet Provider',
      'Wallet Phone',
      'Wallet Email',
      'Bank Name',
      'IBAN / Account',
      'SWIFT Code',
      'Card Verified',
      'Disbursed Order Number',
      'Reason',
      'Admin Notes',
      'Created At',
      'Updated At',
    ];

    const rows = filteredRequests.map((req) => [
      req.id,
      req.backendRefNumber || '',
      req.approvalStatus,
      req.syncStatus,
      req.applicantName,
      req.nationalId,
      req.countryCode,
      req.countryName,
      req.city,
      req.address,
      req.phone,
      req.email,
      req.aidType,
      req.urgencyLevel,
      req.requestedAmount,
      req.currency,
      req.amountUsdEquivalent,
      req.payoutMethod,
      req.digitalWallet.provider,
      req.digitalWallet.phone,
      req.digitalWallet.email,
      req.bankAccount.bankName,
      req.bankAccount.accountOrIban,
      req.bankAccount.swiftCode,
      req.bankAccount.cardVerified ? 'Yes' : 'No',
      req.disbursedOrderNumber || '',
      req.reason,
      req.adminNotes,
      req.createdAt,
      req.updatedAt,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `aid-requests-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const unsyncedCount = localRequests.filter(
    (r) => !r.syncedWithBackend || r.syncStatus !== 'SYNCED'
  ).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-1.5">
            {t.adminTitle}
          </h1>
          <p className="text-sm text-stone-600">{t.adminSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => void refreshAll()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLockPortal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>{t.adminLockBtn}</span>
          </button>
        </div>
      </div>

      {/* 5-Tab Segmented Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl">
          {(
            [
              { id: 'requests', label: `${t.tabRequests} (${requests.length})`, icon: FileText },
              { id: 'orders', label: `${t.tabOrders} (${orders.length})`, icon: ShieldCheck },
              { id: 'directives', label: `${t.tabDirectives} (${directives.length})`, icon: Scale },
              { id: 'local', label: `${t.tabLocalRequests} (${localRequests.length})`, icon: Database },
              { id: 'logs', label: `${t.tabAccessLogs} (${accessLogs.length})`, icon: History },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#064E3B] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {(activeTab === 'requests' || activeTab === 'orders') && (
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, country, REF, ORD..."
                className="w-full ps-9 pe-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B]"
              />
            </div>
            {activeTab === 'requests' && (
              <button
                type="button"
                onClick={handleExportRequestsCsv}
                disabled={filteredRequests.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#064E3B] bg-white hover:bg-emerald-50/60 border border-[#064E3B]/30 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t.exportCsv}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Registration & Order Confirmation Banner */}
      {actionFeedback && (
        <div
          role={actionFeedback.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-[#064E3B]'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{actionFeedback.message}</span>
            {actionFeedback.ref && (
              <span className="font-mono-tabular font-bold px-2 py-0.5 rounded bg-white border border-current/20 shrink-0">
                {actionFeedback.ref}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            aria-label={t.close}
            className="p-1 rounded hover:bg-black/5 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-sm text-stone-500">No requests found.</div>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`w-full text-start p-4 transition-colors ${
                      isSelected ? 'bg-emerald-50/60' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono-tabular text-xs font-semibold text-[#064E3B]">
                        {req.backendRefNumber || req.id}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {req.approvalStatus}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-stone-900 mb-1">
                      {req.applicantName}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                      <span>
                        {req.countryName} · {req.city}
                      </span>
                      <span className="font-mono-tabular font-semibold text-stone-800">
                        {formatCurrency(req.requestedAmount, req.currency)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            {!selectedRequest ? (
              <div className="py-12 text-center text-sm text-stone-500">
                Select a request to audit details, verify cards, and approve disbursement.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="text-xs text-stone-500 font-mono-tabular mb-1">
                      {selectedRequest.backendRefNumber || selectedRequest.id} · {selectedRequest.nationalId}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      {selectedRequest.applicantName}
                    </h2>
                    <div className="text-xs text-stone-600 mt-1">
                      {selectedRequest.countryName} · {selectedRequest.city} · {selectedRequest.phone}
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="font-mono-tabular text-2xl font-bold text-[#064E3B]">
                      {formatCurrency(selectedRequest.requestedAmount, selectedRequest.currency)}
                    </div>
                    <div className="text-xs text-stone-500 font-mono-tabular">
                      ≈ ${selectedRequest.amountUsdEquivalent.toLocaleString()} USD · {selectedRequest.urgencyLevel}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-stone-500 mb-1">{t.reason}</div>
                  <p className="text-sm text-stone-800 leading-relaxed bg-[#FBF9F5] p-3.5 rounded-lg border border-stone-100">
                    {selectedRequest.reason}
                  </p>
                </div>

                {/* Digital Wallet Verification Box */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                      <Wallet className="w-4 h-4 text-[#064E3B]" />
                      <span>{t.payoutWallet}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#064E3B]">
                      {selectedRequest.digitalWallet.provider || '—'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block">{t.walletPhone}</span>
                      <span className="font-mono-tabular text-stone-800">
                        {selectedRequest.digitalWallet.phone || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">{t.walletEmail}</span>
                      <span className="text-stone-800">
                        {selectedRequest.digitalWallet.email || '—'}
                      </span>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-stone-400 block">{t.walletPassword}</span>
                        <span className="font-mono-tabular text-sm font-semibold text-stone-900">
                          {revealedPasswords[selectedRequest.id]
                            ? selectedRequest.digitalWallet.password || '—'
                            : '••••••••••••'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedPasswords((prev) => ({
                            ...prev,
                            [selectedRequest.id]: !prev[selectedRequest.id],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {revealedPasswords[selectedRequest.id] ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{t.hidePassword}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t.revealPassword}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bank Account & Saved Front/Back Card Verification */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                      <CreditCard className="w-4 h-4 text-[#B48A3E]" />
                      <span>{t.payoutBank}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        selectedRequest.bankAccount.cardVerified
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {selectedRequest.bankAccount.cardVerified ? t.cardVerified : t.cardPending}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block">{t.bankName}</span>
                      <span className="font-medium text-stone-900">
                        {selectedRequest.bankAccount.bankName || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">{t.ibanOrAccount}</span>
                      <span className="font-mono-tabular text-stone-900 break-all">
                        {selectedRequest.bankAccount.accountOrIban || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">{t.swiftCode}</span>
                      <span className="font-mono-tabular text-stone-900">
                        {selectedRequest.bankAccount.swiftCode || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        { side: 'front' as const, title: t.cardFront },
                        { side: 'back' as const, title: t.cardBack },
                      ]
                    ).map((card) => {
                      const imgSrc = resolveCardImageSrc(selectedRequest, card.side);
                      return (
                        <div
                          key={card.side}
                          className="border border-stone-200 rounded-lg p-2.5 bg-[#FBF9F5]"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] text-stone-500">{card.title}</span>
                            {imgSrc && (
                              <button
                                type="button"
                                onClick={() => setLightboxImage({ src: imgSrc, title: card.title })}
                                className="text-[11px] font-semibold text-[#064E3B] hover:underline"
                              >
                                View
                              </button>
                            )}
                          </div>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={card.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-28 object-contain rounded bg-white cursor-pointer"
                              onClick={() => setLightboxImage({ src: imgSrc, title: card.title })}
                            />
                          ) : (
                            <div className="h-28 flex items-center justify-center text-xs text-stone-400 bg-white rounded border border-dashed border-stone-200">
                              No Image Attached
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Admin Decision Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    disabled={busyId === selectedRequest.id}
                    onClick={() => void handleVerifyCard(selectedRequest)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>{t.verifyCard}</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={busyId === selectedRequest.id}
                      onClick={() => void handleApproveWallet(selectedRequest)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#064E3B] border border-[#064E3B]/30 hover:bg-emerald-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>{t.approveWallet}</span>
                    </button>

                    <button
                      type="button"
                      disabled={
                        busyId === selectedRequest.id || selectedRequest.approvalStatus === 'DISBURSED'
                      }
                      onClick={() => void handleDisburse(selectedRequest)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>
                        {selectedRequest.disbursedOrderNumber
                          ? selectedRequest.disbursedOrderNumber
                          : t.disburseFunds}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROYAL & ADMIN ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowOrderModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t.issueOrder}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100 mb-3">
                    <span className="font-mono-tabular text-sm font-bold text-[#064E3B]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      {order.status} · {new Date(order.issuedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-stone-900 mb-1.5">
                    {order.title}
                  </h3>
                  <div className="text-xs text-stone-600 mb-3">
                    {order.beneficiaryName} · {order.countryName} · {order.payoutChannel}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{order.notes}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                  <div className="font-mono-tabular text-base font-bold text-[#B48A3E]">
                    {formatCurrency(order.amount, order.currency)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopy(order.orderNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {copiedId === order.orderNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === order.orderNumber ? t.copied : t.copyOrder}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrintableOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#042F2E] hover:bg-stone-900 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t.printOrder}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIRECTIVES & POLICIES */}
      {activeTab === 'directives' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowDirectiveModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createDirective}</span>
            </button>
          </div>

          <div className="space-y-4">
            {directives.map((dir) => (
              <div
                key={dir.id}
                className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-mono-tabular font-semibold text-[#064E3B]">{dir.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{dir.appliesToCountries}</span>
                    <span aria-hidden="true">·</span>
                    <span>{dir.priority === 'high' ? 'High Priority' : 'Standard'}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-stone-900">{dir.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{dir.content}</p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleToggleDirective(dir)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    dir.isActive
                      ? 'bg-emerald-50 text-[#064E3B] border border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {dir.isActive ? 'Active Directive' : 'Paused'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOCAL REQUESTS REPOSITORY */}
      {activeTab === 'local' && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-stone-700">
              <span className="font-semibold text-stone-900">Local Repository: </span>
              <span className="font-mono-tabular">
                {localRequests.length} stored · {unsyncedCount} pending sync
              </span>
            </div>

            <button
              type="button"
              disabled={unsyncedCount === 0 || busyId === 'ALL'}
              onClick={() => void handleSyncAllLocal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${busyId === 'ALL' ? 'animate-spin' : ''}`} />
              <span>{t.syncAllPending}</span>
            </button>
          </div>

          {localRequests.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-10 text-center text-sm text-stone-500">
              No local records stored in this browser yet.
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                  <tr>
                    <th className="py-3 px-4 text-start font-semibold">Local ID</th>
                    <th className="py-3 px-4 text-start font-semibold">{t.fullName}</th>
                    <th className="py-3 px-4 text-start font-semibold">{t.country}</th>
                    <th className="py-3 px-4 text-start font-semibold">{t.requestedAmount}</th>
                    <th className="py-3 px-4 text-start font-semibold">Sync Status</th>
                    <th className="py-3 px-4 text-start font-semibold">Backend Ref</th>
                    <th className="py-3 px-4 text-end font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {localRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4 font-mono-tabular text-stone-700">{item.id}</td>
                      <td className="py-3 px-4 font-medium text-stone-900">{item.applicantName}</td>
                      <td className="py-3 px-4 text-stone-600">{item.countryName}</td>
                      <td className="py-3 px-4 font-mono-tabular font-semibold text-stone-900">
                        {formatCurrency(item.requestedAmount, item.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            item.syncedWithBackend
                              ? 'text-emerald-700'
                              : item.syncStatus === 'FAILED'
                                ? 'text-red-700'
                                : 'text-amber-700'
                          }`}
                        >
                          {item.syncedWithBackend
                            ? t.syncedLabel
                            : item.syncStatus === 'FAILED'
                              ? t.failedLabel
                              : t.pendingLocalLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono-tabular text-[#064E3B]">
                        {item.backendRefNumber || '—'}
                      </td>
                      <td className="py-3 px-4 text-end">
                        {!item.syncedWithBackend && (
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => void handleSyncOneLocal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-md transition-colors whitespace-nowrap"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{t.syncOne}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ACCESS LOGS & SAVED CARD IMAGES */}
      {activeTab === 'logs' && (
        <div className="space-y-8">
          {/* Saved Images Archive */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <ImageIcon className="w-4 h-4 text-[#064E3B]" />
                <span>Saved Card & Attachment Images ({savedImagesList.length})</span>
              </div>
            </div>

            {savedImagesList.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-xs text-stone-500">
                Uploaded bank card images from submitted requests are automatically saved to disk and appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedImagesList.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white border border-stone-200 rounded-xl p-3 space-y-2.5"
                  >
                    <img
                      src={img.src}
                      alt={`${img.applicant} - ${img.label}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-contain rounded-lg bg-[#FBF9F5] border border-stone-100 cursor-pointer"
                      onClick={() =>
                        setLightboxImage({ src: img.src, title: `${img.applicant} · ${img.label}` })
                      }
                    />
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-900 truncate">{img.applicant}</div>
                        <div className="text-stone-500 font-mono-tabular">
                          {img.ref} · {img.label}
                        </div>
                      </div>
                      <a
                        href={img.src}
                        download={`${img.ref}_${img.id}.jpg`}
                        className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 shrink-0"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recorded Entry & Login Events */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <History className="w-4 h-4 text-[#064E3B]" />
              <span>Recorded Portal Entries, Submissions & Admin Logins ({accessLogs.length})</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                  <tr>
                    <th className="py-3 px-4 text-start font-semibold">Timestamp</th>
                    <th className="py-3 px-4 text-start font-semibold">Event</th>
                    <th className="py-3 px-4 text-start font-semibold">Actor</th>
                    <th className="py-3 px-4 text-start font-semibold">Details</th>
                    <th className="py-3 px-4 text-start font-semibold">Region / Lang</th>
                    <th className="py-3 px-4 text-start font-semibold">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4 font-mono-tabular text-stone-600 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono-tabular font-semibold">
                        <span
                          className={
                            log.eventType === 'ADMIN_LOGIN_FAILED'
                              ? 'text-red-700'
                              : log.eventType === 'ADMIN_LOGIN_SUCCESS' ||
                                  log.eventType === 'ORDER_ISSUED'
                                ? 'text-[#064E3B]'
                                : log.eventType === 'REQUEST_UPDATED' ||
                                    log.eventType === 'DIRECTIVE_SAVED'
                                  ? 'text-[#B48A3E]'
                                  : 'text-stone-800'
                          }
                        >
                          {log.eventType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-900">{log.actorLabel}</td>
                      <td className="py-3 px-4 text-stone-700">{log.details}</td>
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">{log.countryOrLang}</td>
                      <td className="py-3 px-4 text-stone-500 max-w-[200px] truncate" title={log.userAgent}>
                        {log.userAgent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* MODAL: ISSUE NEW ROYAL / ADMIN ORDER */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-xl font-bold text-stone-900">{t.issueOrder}</h3>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => void handleCreateOrder(e)} className="space-y-3 text-sm">
              <input
                type="text"
                required
                placeholder="Order Title (e.g. Royal Emergency Medical Grant)"
                value={orderTitle}
                onChange={(e) => setOrderTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Beneficiary Name"
                  value={orderBeneficiary}
                  onChange={(e) => setOrderBeneficiary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Country / Region"
                  value={orderCountry}
                  onChange={(e) => setOrderCountry(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  placeholder="Amount"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  className="w-full px-3.5 py-2 font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Currency (USD, SAR, EUR)"
                  value={orderCurrency}
                  onChange={(e) => setOrderCurrency(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 font-mono-tabular bg-[#FBF9F5] border border-stone-200 rounded-lg"
                />
              </div>
              <input
                type="text"
                placeholder="Payout Channel"
                value={orderChannel}
                onChange={(e) => setOrderChannel(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
              />
              <textarea
                rows={3}
                placeholder="Executive Notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] rounded-lg"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE DIRECTIVE */}
      {showDirectiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-xl font-bold text-stone-900">{t.createDirective}</h3>
              <button
                type="button"
                onClick={() => setShowDirectiveModal(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => void handleCreateDirective(e)} className="space-y-3 text-sm">
              <input
                type="text"
                required
                placeholder="Directive Title"
                value={dirTitle}
                onChange={(e) => setDirTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={dirCategory}
                  onChange={(e) => setDirCategory(e.target.value as AdminDirective['category'])}
                  className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
                >
                  <option value="global_compliance">Global Compliance</option>
                  <option value="wallet_security">Wallet Security</option>
                  <option value="vehicle_aid">Vehicle Aid Rules</option>
                  <option value="priority_criteria">Priority Criteria</option>
                </select>
                <select
                  value={dirPriority}
                  onChange={(e) => setDirPriority(e.target.value as 'high' | 'standard')}
                  className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
                >
                  <option value="high">High Priority</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Applies To Countries"
                value={dirCountries}
                onChange={(e) => setDirCountries(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
              />
              <textarea
                rows={4}
                required
                placeholder="Policy Details & Operational Rules"
                value={dirContent}
                onChange={(e) => setDirContent(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FBF9F5] border border-stone-200 rounded-lg"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDirectiveModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] rounded-lg"
                >
                  Save Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL PRINTABLE ROYAL ORDER */}
      {printableOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#FBF9F5] border-2 border-[#B48A3E] rounded-2xl p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-start gap-3.5">
                <img
                  src="/assets/aistudio/images__2__b2b4cdf7.jpeg"
                  alt={printableOrder.issuedBy}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover object-top border border-[#B48A3E] shrink-0"
                />
                <div>
                  <div className="text-xs font-semibold text-[#B48A3E] mb-1">
                    {printableOrder.issuedBy}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    {printableOrder.title}
                  </h3>
                  <div className="font-mono-tabular text-sm font-bold text-[#064E3B] mt-1">
                    {printableOrder.orderNumber}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrintableOrder(null)}
                className="no-print p-1.5 rounded-lg text-stone-500 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-stone-500 block">Beneficiary</span>
                <span className="font-semibold text-stone-900">{printableOrder.beneficiaryName}</span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Country</span>
                <span className="font-semibold text-stone-900">{printableOrder.countryName}</span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Approved Amount</span>
                <span className="font-mono-tabular font-bold text-[#064E3B]">
                  {formatCurrency(printableOrder.amount, printableOrder.currency)}
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Payout Channel</span>
                <span className="font-medium text-stone-900">{printableOrder.payoutChannel}</span>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-white p-4 rounded-lg border border-stone-200">
              {printableOrder.notes}
            </p>

            <div className="no-print flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] rounded-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print Decree</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FULL IMAGE VIEWER */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-2xl w-full bg-white rounded-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-sm font-bold text-stone-900">{lightboxImage.title}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[70vh] object-contain rounded-lg bg-stone-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}

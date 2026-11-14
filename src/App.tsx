import { useEffect, useState } from 'react';
import { Globe, Printer, Wifi, WifiOff, FileDown } from 'lucide-react';
import type { AidRequest, Language } from './types/aid';
import { TRANSLATIONS } from './i18n/translations';
import { HomePortal } from './components/HomePortal';
import { AidRequestForm } from './components/AidRequestForm';
import { TrackRequestView } from './components/TrackRequestView';
import { AdminReviewPortal } from './components/AdminReviewPortal';
import { SuccessCelebrationModal } from './components/SuccessCelebrationModal';
import {
  fetchPublicDirectivesCount,
  isStandaloneFileMode,
  logAccessEvent,
} from './services/requestRepository';

type AppView = 'home' | 'apply' | 'track' | 'admin';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [view, setView] = useState<AppView>('home');
  const [submittedRequest, setSubmittedRequest] = useState<AidRequest | null>(null);
  const [trackQuery, setTrackQuery] = useState('');
  const [activeDirectivesCount, setActiveDirectivesCount] = useState(3);
  const [applyKey, setApplyKey] = useState(0);
  const [isSyncOnline, setIsSyncOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const isRtl = lang === 'ar';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  useEffect(() => {
    void fetchPublicDirectivesCount()
      .then((count) => setActiveDirectivesCount(count))
      .catch(() => {});

    const sessionRecordedKey = 'talal_entry_logged_v1';
    if (!sessionStorage.getItem(sessionRecordedKey)) {
      sessionStorage.setItem(sessionRecordedKey, '1');
      void logAccessEvent({
        eventType: 'PORTAL_ENTRY',
        actorLabel: 'زائر البوابة',
        details: 'دخول جديد إلى بوابة مؤسسة الوليد للإنسانية',
        countryOrLang: `Global · ${lang.toUpperCase()}`,
      });
    }
  }, [lang]);

  useEffect(() => {
    let active = true;

    const checkSyncHealth = async () => {
      if (isStandaloneFileMode() || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        if (active) setIsSyncOnline(false);
        return;
      }
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });
        if (active) setIsSyncOnline(res.ok);
      } catch {
        if (active) setIsSyncOnline(false);
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    const handleOnline = () => {
      setIsSyncOnline(true);
      void checkSyncHealth();
    };

    const handleOffline = () => {
      setIsSyncOnline(false);
    };

    void checkSyncHealth();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const intervalId = window.setInterval(() => {
      void checkSyncHealth();
    }, 30000);

    return () => {
      active = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.clearInterval(intervalId);
    };
  }, []);

  const handleSuccess = (req: AidRequest) => {
    setSubmittedRequest(req);
  };

  const handleTrackFromModal = (refOrId: string) => {
    setSubmittedRequest(null);
    setTrackQuery(refOrId);
    setView('track');
  };

  const handleNewRequestFromModal = () => {
    setSubmittedRequest(null);
    setApplyKey((k) => k + 1);
    setView('apply');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Single-line Brand Title with Program Icon */}
          <button
            type="button"
            onClick={() => setView('home')}
            className="inline-flex items-center gap-3 font-display text-lg sm:text-xl font-bold text-[#064E3B] whitespace-nowrap shrink-0 text-start"
          >
            <img
              src="/assets/aistudio/images__2__b2b4cdf7.jpeg"
              alt={t.brandName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover object-top border border-[#B48A3E]/70 shrink-0"
            />
            <span>{t.brandName}</span>
          </button>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {(
              [
                { id: 'home', label: t.navHome },
                { id: 'apply', label: t.navApply },
                { id: 'track', label: t.navTrack },
                { id: 'admin', label: t.navAdmin },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  view === item.id
                    ? 'border-[#064E3B] text-[#064E3B] font-semibold'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Sync Status Indicator, Print Action & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div
              role="status"
              aria-live="polite"
              title={isSyncOnline ? t.syncStatusOnlineTooltip : t.syncStatusOfflineTooltip}
              aria-label={isSyncOnline ? t.syncStatusOnline : t.syncStatusOffline}
              className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 transition-colors ${
                isSyncOnline
                  ? 'bg-emerald-50/70 text-[#064E3B] border-emerald-200/80'
                  : 'bg-amber-50/80 text-amber-900 border-amber-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isSyncOnline ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              />
              {isSyncOnline ? (
                <Wifi className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden lg:inline">
                {isSyncOnline ? t.syncStatusOnline : t.syncStatusOffline}
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              aria-label={t.printDocument}
              title={t.printDocument}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#064E3B] bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.printDocument}</span>
            </button>
            <button
              type="button"
              onClick={() => setView('apply')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {t.primaryCta}
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Workspace Utility Ribbon: Mobile Nav + Global Language Switcher */}
      <div className="no-print border-b border-stone-200/80 bg-white/70">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex md:hidden items-center gap-4 text-xs font-medium text-stone-700 overflow-x-auto">
            {(
              [
                { id: 'home', label: t.navHome },
                { id: 'apply', label: t.navApply },
                { id: 'track', label: t.navTrack },
                { id: 'admin', label: t.navAdmin },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`whitespace-nowrap shrink-0 ${
                  view === item.id ? 'text-[#064E3B] font-bold underline underline-offset-4' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500">
            <Globe className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>{t.footerGlobalNote}</span>
          </div>

          <div className="flex items-center gap-2 ms-auto">
            {!isStandaloneFileMode() && (
              <a
                href="/prince-talal-portal.html"
                download="prince-talal-portal.html"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#064E3B] bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <FileDown className="w-3.5 h-3.5 shrink-0" />
                <span>{t.downloadHtmlApp}</span>
              </a>
            )}
            <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    lang === item.code
                      ? 'bg-white text-[#064E3B] shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 pt-8">
        {view === 'home' && (
          <HomePortal
            t={t}
            lang={lang}
            isRtl={isRtl}
            totalDirectivesCount={activeDirectivesCount}
            onNavigateApply={() => setView('apply')}
            onNavigateTrack={() => setView('track')}
            onNavigateAdmin={() => setView('admin')}
          />
        )}

        {view === 'apply' && (
          <AidRequestForm key={applyKey} t={t} lang={lang} onSuccess={handleSuccess} />
        )}

        {view === 'track' && (
          <TrackRequestView t={t} lang={lang} initialQuery={trackQuery} />
        )}

        {view === 'admin' && (
          <AdminReviewPortal
            t={t}
            lang={lang}
            onDirectivesChanged={(count) => setActiveDirectivesCount(count)}
          />
        )}
      </main>

      {/* Clean Institutional Footer */}
      <footer className="no-print border-t border-stone-200 bg-white mt-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <span>{t.footerRights}</span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setView('apply')} className="hover:text-stone-900">
              {t.navApply}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setView('track')} className="hover:text-stone-900">
              {t.navTrack}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setView('admin')} className="hover:text-stone-900">
              {t.navAdmin}
            </button>
          </div>
        </div>
      </footer>

      {/* Lottie-Style Celebration Modal on Submission */}
      <SuccessCelebrationModal
        request={submittedRequest}
        t={t}
        isRtl={isRtl}
        onClose={() => setSubmittedRequest(null)}
        onTrack={handleTrackFromModal}
        onNewRequest={handleNewRequestFromModal}
      />
    </div>
  );
}

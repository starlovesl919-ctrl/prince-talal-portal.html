import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Globe, AlertCircle, History, X, Trash2 } from 'lucide-react';
import type { AdminOrder, AidRequest, Language } from '../types/aid';
import type { Translations } from '../i18n/translations';
import { trackRequestQuery } from '../services/requestRepository';
import { formatCurrency } from '../data/globalConfig';
import { RequestTimeline } from './RequestTimeline';

const RECENT_TRACKING_IDS_KEY = 'talal_recent_tracking_ids_v1';
const MAX_RECENT_IDS = 5;

function loadRecentTrackingIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_TRACKING_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, MAX_RECENT_IDS);
  } catch {
    return [];
  }
}

function persistRecentTrackingIds(ids: string[]): void {
  try {
    if (ids.length === 0) {
      localStorage.removeItem(RECENT_TRACKING_IDS_KEY);
    } else {
      localStorage.setItem(RECENT_TRACKING_IDS_KEY, JSON.stringify(ids));
    }
  } catch {
    // Ignore storage quota errors safely
  }
}

interface TrackRequestViewProps {
  t: Translations;
  lang?: Language;
  initialQuery?: string;
}

export function TrackRequestView({ t, lang = 'ar', initialQuery = '' }: TrackRequestViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{ request: AidRequest; order: AdminOrder | null } | null>(null);
  const [recentTrackingIds, setRecentTrackingIds] = useState<string[]>(() => loadRecentTrackingIds());

  const recordRecentTrackingId = useCallback((trackingId: string) => {
    const normalized = trackingId.trim();
    if (!normalized) return;
    setRecentTrackingIds((prev) => {
      const next = [
        normalized,
        ...prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase()),
      ].slice(0, MAX_RECENT_IDS);
      persistRecentTrackingIds(next);
      return next;
    });
  }, []);

  const removeRecentTrackingId = (trackingId: string) => {
    setRecentTrackingIds((prev) => {
      const next = prev.filter((item) => item.toLowerCase() !== trackingId.toLowerCase());
      persistRecentTrackingIds(next);
      return next;
    });
  };

  const clearRecentTrackingIds = () => {
    setRecentTrackingIds([]);
    persistRecentTrackingIds([]);
  };

  const runSearch = useCallback(
    async (target: string) => {
      const clean = target.trim();
      if (!clean) return;
      setLoading(true);
      setSearched(true);
      recordRecentTrackingId(clean);
      try {
        const found = await trackRequestQuery(clean);
        setResult(found);
      } finally {
        setLoading(false);
      }
    },
    [recordRecentTrackingId]
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      void runSearch(initialQuery);
    }
  }, [initialQuery, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          {t.trackTitle}
        </h1>
        <p className="text-sm sm:text-base text-stone-600">{t.trackSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.trackPlaceholder}
            className="w-full ps-10 pe-4 py-2.5 text-sm bg-[#FBF9F5] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
        >
          {t.trackSearchBtn}
        </button>
      </form>

      {/* Quick sample reference hints & Recent Searches */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span>Quick Lookup:</span>
          {['REF-2026-1049', 'REF-2026-1054', 'REF-2026-1061', 'REF-2026-1068'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQuery(sample);
                void runSearch(sample);
              }}
              className="font-mono-tabular text-[#064E3B] hover:underline"
            >
              {sample}
            </button>
          ))}
        </div>

        {recentTrackingIds.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 me-1">
                <History className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>{t.recentSearches}:</span>
              </span>
              {recentTrackingIds.map((trackingId) => {
                const isActive = query.trim().toLowerCase() === trackingId.toLowerCase();
                return (
                  <div
                    key={trackingId}
                    className={`inline-flex items-center rounded-lg border text-xs transition-colors ${
                      isActive
                        ? 'border-[#064E3B] bg-emerald-50/70 text-[#064E3B]'
                        : 'border-stone-200 bg-[#FBF9F5] text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(trackingId);
                        void runSearch(trackingId);
                      }}
                      className="font-mono-tabular px-2.5 py-1 font-medium hover:text-[#064E3B]"
                    >
                      {trackingId}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRecentTrackingId(trackingId)}
                      aria-label={`${t.close} ${trackingId}`}
                      className="pe-1.5 ps-0.5 py-1 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={clearRecentTrackingIds}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-700 bg-[#FBF9F5] hover:bg-rose-50 border border-stone-200 hover:border-rose-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearRecentSearches}</span>
            </button>
          </div>
        )}
      </div>

      {searched && !loading && !result && (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-800">{t.trackNotFound}</p>
        </div>
      )}

      {result && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 bg-[#042F2E] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-200/85 mb-1">
                {result.request.backendRefNumber || result.request.id} · {result.request.countryName}
              </div>
              <h2 className="font-display text-2xl font-bold">{result.request.applicantName}</h2>
            </div>
            <div className="text-end">
              <div className="font-mono-tabular text-xl font-bold text-[#E7C680]">
                {formatCurrency(result.request.requestedAmount, result.request.currency)}
              </div>
              <div className="text-xs text-stone-300 font-mono-tabular">
                ≈ ${result.request.amountUsdEquivalent.toLocaleString()} USD
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Visual Progress Timeline */}
            <RequestTimeline
              request={result.request}
              order={result.order}
              t={t}
              lang={lang}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-sm">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-500">{t.sectionApplicant}</div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Globe className="w-4 h-4 text-[#064E3B]" />
                  <span>
                    {result.request.countryName} · {result.request.city}
                  </span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">{result.request.reason}</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-500">{t.sectionPayout}</div>
                <div className="text-xs text-stone-700 space-y-1">
                  <div>
                    <span className="text-stone-400">{t.walletProvider}: </span>
                    <span className="font-medium">{result.request.digitalWallet.provider || '—'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">{t.bankName}: </span>
                    <span className="font-medium">{result.request.bankAccount.bankName || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.order && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#B48A3E] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-mono-tabular text-sm font-bold text-stone-900">
                      {result.order.orderNumber}
                    </div>
                    <div className="text-xs text-stone-700">{result.order.title}</div>
                  </div>
                </div>
                <div className="font-mono-tabular text-sm font-semibold text-[#064E3B]">
                  {formatCurrency(result.order.amount, result.order.currency)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

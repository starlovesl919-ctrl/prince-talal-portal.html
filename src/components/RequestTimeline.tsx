import {
  Check,
  Clock,
  FileCheck2,
  FileSearch,
  Inbox,
  Landmark,
  MessageSquareText,
  XCircle,
} from 'lucide-react';
import type { AdminOrder, AidRequest, Language } from '../types/aid';
import type { Translations } from '../i18n/translations';

interface RequestTimelineProps {
  request: AidRequest;
  order: AdminOrder | null;
  t: Translations;
  lang?: Language;
}

type StageState = 'completed' | 'current' | 'pending' | 'rejected';

interface TimelineStage {
  key: 'received' | 'reviewing' | 'approved' | 'disbursed';
  title: string;
  description: string;
  meta: string;
  state: StageState;
  icon: typeof Inbox;
}

function formatDateLabel(isoDate: string | undefined, lang: Language): string {
  if (!isoDate) return '—';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '—';
  const localeMap: Record<Language, string> = {
    ar: 'ar-SA',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
  };
  return new Intl.DateTimeFormat(localeMap[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export function RequestTimeline({
  request,
  order,
  t,
  lang = 'ar',
}: RequestTimelineProps) {
  const isRejected = request.approvalStatus === 'REJECTED';

  const stageIndexMap: Record<AidRequest['approvalStatus'], number> = {
    SUBMITTED: 0,
    UNDER_REVIEW: 1,
    WALLET_APPROVED: 2,
    DISBURSED: 3,
    REJECTED: 2,
  };

  const activeIdx = stageIndexMap[request.approvalStatus] ?? 0;
  const isFullyDisbursed = request.approvalStatus === 'DISBURSED';

  const resolveState = (index: number): StageState => {
    if (isRejected) {
      if (index < 2) return 'completed';
      if (index === 2) return 'rejected';
      return 'pending';
    }
    if (isFullyDisbursed) return 'completed';
    if (index < activeIdx) return 'completed';
    if (index === activeIdx) return 'current';
    return 'pending';
  };

  const stages: TimelineStage[] = [
    {
      key: 'received',
      title: t.timelineStageReceived,
      description: t.timelineStageReceivedDesc,
      meta: `${request.backendRefNumber || request.id} · ${formatDateLabel(request.createdAt, lang)}`,
      state: resolveState(0),
      icon: Inbox,
    },
    {
      key: 'reviewing',
      title: t.timelineStageReviewing,
      description: t.timelineStageReviewingDesc,
      meta: request.syncedWithBackend ? t.syncedLabel : t.pendingLocalLabel,
      state: resolveState(1),
      icon: FileSearch,
    },
    {
      key: 'approved',
      title: isRejected ? t.timelineStageRejected : t.timelineStageApproved,
      description: t.timelineStageApprovedDesc,
      meta: request.bankAccount.cardVerified ? t.cardVerified : t.cardPending,
      state: resolveState(2),
      icon: isRejected ? XCircle : FileCheck2,
    },
    {
      key: 'disbursed',
      title: t.timelineStageDisbursed,
      description: t.timelineStageDisbursedDesc,
      meta:
        request.disbursedOrderNumber ||
        order?.orderNumber ||
        (order?.issuedAt ? formatDateLabel(order.issuedAt, lang) : '—'),
      state: resolveState(3),
      icon: Landmark,
    },
  ];

  const progressPercent = isRejected
    ? 50
    : isFullyDisbursed
      ? 100
      : (activeIdx + 1) * 25;

  const getStateLabel = (state: StageState) => {
    switch (state) {
      case 'completed':
        return t.timelineStatusCompleted;
      case 'current':
        return t.timelineStatusCurrent;
      case 'rejected':
        return t.timelineStageRejected;
      default:
        return t.timelineStatusPending;
    }
  };

  return (
    <section aria-label={t.timelineTitle} className="space-y-5">
      {/* Timeline Header + Progress Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-stone-900">
            {t.timelineTitle}
          </h3>
          <p className="text-xs text-stone-500 font-mono-tabular">
            {t.timelineUpdatedAt}: {formatDateLabel(request.updatedAt, lang)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`font-mono-tabular text-xs font-semibold px-2.5 py-1 rounded-md border ${
              isRejected
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : isFullyDisbursed
                  ? 'bg-emerald-50 text-[#064E3B] border-emerald-200'
                  : 'bg-amber-50 text-[#926B28] border-amber-200'
            }`}
          >
            {isRejected ? t.timelineStageRejected : `${progressPercent}%`}
          </span>
        </div>
      </div>

      {/* Overall Progress Track */}
      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isRejected ? 'bg-rose-600' : 'bg-[#064E3B]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Desktop Horizontal Connected Stepper */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 pt-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;
          const isFirst = idx === 0;
          const prevDone = idx > 0 && stages[idx - 1].state === 'completed';
          const nextDone =
            stage.state === 'completed' && !isLast && stages[idx + 1].state !== 'pending';

          const circleClass =
            stage.state === 'completed'
              ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm'
              : stage.state === 'current'
                ? 'bg-white text-[#064E3B] border-[#B48A3E] ring-4 ring-[#B48A3E]/20 shadow-sm'
                : stage.state === 'rejected'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-stone-50 text-stone-400 border-stone-200';

          const cardClass =
            stage.state === 'completed'
              ? 'border-emerald-200/90 bg-emerald-50/30'
              : stage.state === 'current'
                ? 'border-[#B48A3E]/60 bg-[#FBF9F5] shadow-sm'
                : stage.state === 'rejected'
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-stone-200/80 bg-stone-50/40';

          const badgeClass =
            stage.state === 'completed'
              ? 'text-[#064E3B] bg-emerald-100/70'
              : stage.state === 'current'
                ? 'text-[#8C6623] bg-amber-100/80'
                : stage.state === 'rejected'
                  ? 'text-rose-800 bg-rose-100'
                  : 'text-stone-500 bg-stone-100';

          return (
            <div key={stage.key} className="relative flex flex-col items-center text-center">
              {/* Connector Track Row */}
              <div className="relative w-full flex items-center justify-center mb-3">
                {/* Leading half-line */}
                {!isFirst && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 start-0 end-1/2 h-0.5 ${
                      prevDone
                        ? stage.state === 'rejected'
                          ? 'bg-rose-300'
                          : 'bg-[#064E3B]'
                        : 'bg-stone-200'
                    }`}
                  />
                )}
                {/* Trailing half-line */}
                {!isLast && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 start-1/2 end-0 h-0.5 ${
                      nextDone ? 'bg-[#064E3B]' : 'bg-stone-200'
                    }`}
                  />
                )}

                {/* Node */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${circleClass}`}
                >
                  {stage.state === 'completed' ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Stage Detail Card */}
              <div className={`w-full flex-1 rounded-xl border p-3.5 text-start flex flex-col justify-between gap-2 ${cardClass}`}>
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="font-mono-tabular text-[11px] font-semibold text-stone-400">
                      0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${badgeClass}`}>
                      {getStateLabel(stage.state)}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mb-0.5">{stage.title}</div>
                  <p className="text-xs text-stone-600 leading-relaxed">{stage.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-200/70 font-mono-tabular text-[11px] text-stone-600 truncate">
                  {stage.meta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Connected Stepper */}
      <div className="md:hidden space-y-0">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;

          const circleClass =
            stage.state === 'completed'
              ? 'bg-[#064E3B] text-white border-[#064E3B]'
              : stage.state === 'current'
                ? 'bg-white text-[#064E3B] border-[#B48A3E] ring-4 ring-[#B48A3E]/20'
                : stage.state === 'rejected'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-stone-50 text-stone-400 border-stone-200';

          const cardClass =
            stage.state === 'completed'
              ? 'border-emerald-200/90 bg-emerald-50/30'
              : stage.state === 'current'
                ? 'border-[#B48A3E]/60 bg-[#FBF9F5]'
                : stage.state === 'rejected'
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-stone-200/80 bg-stone-50/40';

          return (
            <div key={stage.key} className="flex gap-3.5">
              {/* Vertical Rail */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 ${circleClass}`}
                >
                  {stage.state === 'completed' ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : stage.state === 'pending' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-4 my-1 ${
                      stage.state === 'completed' ? 'bg-[#064E3B]' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>

              {/* Card */}
              <div className={`flex-1 rounded-xl border p-3.5 mb-3 ${cardClass}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-stone-900">{stage.title}</span>
                  <span className="text-[11px] font-semibold text-stone-600">
                    {getStateLabel(stage.state)}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-2">{stage.description}</p>
                <div className="font-mono-tabular text-[11px] text-stone-500 truncate">
                  {stage.meta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Administrative Notes Callout (if present) */}
      {request.adminNotes && (
        <div className="rounded-xl border border-stone-200 bg-[#FBF9F5] p-4 flex items-start gap-3">
          <MessageSquareText className="w-4 h-4 text-[#064E3B] mt-0.5 shrink-0" />
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-stone-800">{t.timelineAdminNote}</div>
            <p className="text-stone-600 leading-relaxed">{request.adminNotes}</p>
          </div>
        </div>
      )}
    </section>
  );
}

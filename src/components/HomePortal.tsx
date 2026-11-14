import { Globe, ArrowRight, ChevronDown, ShieldCheck, HeartHandshake, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Language } from '../types/aid';
import type { Translations } from '../i18n/translations';
import { AID_TYPES, GLOBAL_COUNTRIES } from '../data/globalConfig';

interface HomePortalProps {
  t: Translations;
  lang: Language;
  isRtl: boolean;
  totalDirectivesCount: number;
  onNavigateApply: () => void;
  onNavigateTrack: () => void;
  onNavigateAdmin: () => void;
}

const HERO_BACKDROP = '/src/assets/images/bg_app_internal_1794589196338.jpg';
const TEAM_PHOTO = '/src/assets/images/hero_humanitarian_global_1794589196128.jpg';
const PROGRAMS_PHOTO = '/src/assets/images/program_medical_housing_1794589196647.jpg';

export function HomePortal({
  t,
  lang,
  isRtl,
  totalDirectivesCount,
  onNavigateApply,
  onNavigateTrack,
  onNavigateAdmin,
}: HomePortalProps) {
  const getAidLabel = (item: (typeof AID_TYPES)[number]) => {
    if (lang === 'ar') return item.labelAr;
    if (lang === 'fr') return item.labelFr;
    if (lang === 'es') return item.labelEs;
    return item.labelEn;
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Entry Start Screen (صفحة بداية الدخول) */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-900/30 bg-[#055739] text-white min-h-[540px] sm:min-h-[600px] flex flex-col items-center justify-center text-center px-6 py-16">
        <img
          src={HERO_BACKDROP}
          alt={t.entryTitle}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#043F2B]/80 via-[#065F40]/85 to-[#043624]/95" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* Kicker */}
          <p className="text-xs sm:text-sm font-medium text-emerald-100/95 tracking-wide pb-2 border-b border-white/25 mb-7">
            {t.entryKicker}
          </p>

          {/* Main Brand Display Heading */}
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight text-white mb-4 [text-wrap:balance]">
            {t.entryTitle}
          </h1>

          {/* Hopeful Subheadline */}
          <p className="text-lg sm:text-2xl font-medium text-emerald-50/95 mb-10">
            {t.entrySubtitle}
          </p>

          {/* Primary & Secondary Centered Entry Buttons */}
          <div className="w-full max-w-xs flex flex-col gap-3.5">
            <button
              type="button"
              onClick={onNavigateApply}
              className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-[#064E3B] bg-white hover:bg-emerald-50 rounded-xl shadow-lg transition-colors whitespace-nowrap"
            >
              <span>{t.entryApplyBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onNavigateTrack}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-black/15 border border-white/75 hover:bg-white/10 rounded-xl transition-colors whitespace-nowrap"
            >
              <span>{t.entryTrackBtn}</span>
            </button>
          </div>

          {/* Bottom Scroll / Projects Anchor */}
          <button
            type="button"
            onClick={scrollToProjects}
            className="mt-10 inline-flex flex-col items-center gap-1.5 text-xs font-semibold text-emerald-100 hover:text-white transition-colors"
          >
            <span>{t.entryExploreProjects}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Projects & Global Humanitarian Coverage */}
      <section id="projects-overview" aria-label={t.globalReachTitle} className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#064E3B] font-semibold mb-1.5">
              <Globe className="w-4 h-4" />
              <span>{t.brandName} · {GLOBAL_COUNTRIES.length}+ {t.statCountriesLabel}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              {t.globalReachTitle}
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">{t.globalReachSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-stone-200 pb-8">
          <div>
            <div className="font-mono-tabular text-3xl font-bold text-[#064E3B] mb-1">
              {GLOBAL_COUNTRIES.length}+
            </div>
            <div className="text-sm font-medium text-stone-700">{t.statCountriesLabel}</div>
          </div>
          <div>
            <div className="font-mono-tabular text-3xl font-bold text-[#064E3B] mb-1">6</div>
            <div className="text-sm font-medium text-stone-700">{t.statRegionsLabel}</div>
          </div>
          <div>
            <div className="font-mono-tabular text-3xl font-bold text-[#064E3B] mb-1">100%</div>
            <div className="text-sm font-medium text-stone-700">{t.statSyncLabel}</div>
          </div>
          <div>
            <div className="font-mono-tabular text-3xl font-bold text-[#064E3B] mb-1">
              {totalDirectivesCount}
            </div>
            <div className="text-sm font-medium text-stone-700">{t.statDirectivesLabel}</div>
          </div>
        </div>
      </section>

      {/* Programs & Field Operations Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="text-xs text-stone-500 mb-2">
              {t.brandName} · {t.programsTitle}
            </div>
            <h2 className="font-display text-3xl font-bold text-stone-900 mb-3 [text-wrap:balance]">
              {t.programsTitle}
            </h2>
            <p className="text-base text-stone-600 leading-relaxed mb-8">
              {t.programsSubtitle}
            </p>

            <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {AID_TYPES.map((item, idx) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tabular text-xs text-stone-400">
                      0{idx + 1}.
                    </span>
                    <span className="font-semibold text-stone-900">{getAidLabel(item)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onNavigateApply}
                    className="text-xs font-medium text-[#064E3B] hover:underline whitespace-nowrap shrink-0"
                  >
                    {t.primaryCta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-56">
              <img
                src={TEAM_PHOTO}
                alt={t.globalReachTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-56">
              <img
                src={PROGRAMS_PHOTO}
                alt={t.programsTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#064E3B] shrink-0" />
                <span>{t.charterTitle}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                {t.charterBody}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-100 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#B48A3E]" />
                <span>{t.payoutWallet}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>IBAN / SWIFT</span>
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="font-semibold text-[#064E3B] hover:underline"
              >
                {t.navAdmin}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

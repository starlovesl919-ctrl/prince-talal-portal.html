import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, ArrowRight, FileCheck2, X, Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { AidRequest } from '../types/aid';
import type { Translations } from '../i18n/translations';
import { formatCurrency } from '../data/globalConfig';

interface SuccessCelebrationModalProps {
  request: AidRequest | null;
  t: Translations;
  isRtl: boolean;
  onClose: () => void;
  onTrack: (refOrId: string) => void;
  onNewRequest: () => void;
}

const BURST_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const distance = i % 2 === 0 ? 74 : 58;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: i % 2 === 0 ? 7 : 5,
    color: i % 2 === 0 ? '#065F46' : '#B48A3E',
    delay: 0.15 + i * 0.025,
  };
});

export function SuccessCelebrationModal({
  request,
  t,
  isRtl,
  onClose,
  onTrack,
  onNewRequest,
}: SuccessCelebrationModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  if (!request) return null;

  const refCode = request.backendRefNumber || request.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored safely
    }
  };

  const handleDownloadPdf = async () => {
    const node = receiptRef.current;
    if (!node || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfError(null);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        onclone: (clonedDoc) => {
          clonedDoc.documentElement.style.backgroundColor = '#FFFFFF';
          clonedDoc.body.style.backgroundColor = '#FFFFFF';
          clonedDoc.body.style.color = '#1C1917';
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;
      const xOffset = (pageWidth - renderWidth) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, margin, renderWidth, renderHeight, undefined, 'FAST');
      const safeRef = refCode.replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`aid-receipt-${safeRef}.pdf`);
    } catch {
      setPdfError(t.pdfReceiptError);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const issuedDate = new Date(request.createdAt || Date.now()).toLocaleDateString(
    isRtl ? 'ar-SA' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const payoutLabel =
    request.payoutMethod === 'digital_wallet'
      ? t.payoutWallet
      : request.payoutMethod === 'bank_account'
        ? t.payoutBank
        : t.payoutBoth;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#FBF9F5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#064E3B] via-[#B48A3E] to-[#064E3B]" />

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-6 pt-8 pb-7 sm:px-8 text-center">
            {/* Lottie-style animated vector checkmark shield */}
            <div className="relative mx-auto w-36 h-36 flex items-center justify-center mb-4">
              {/* Concentric expanding ripple rings */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.6, 1.15, 1.05], opacity: [0, 0.35, 0] }}
                transition={{ duration: 1.4, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.2 }}
                className="absolute inset-2 rounded-full border-2 border-[#B48A3E]/50"
              />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.7, 1.05, 1], opacity: [0, 0.45, 0.15] }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-4 rounded-full bg-emerald-900/10"
              />

              {/* Radial celebratory particles */}
              {BURST_PARTICLES.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0, 1.1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.9, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                  }}
                  className="absolute rounded-full pointer-events-none"
                />
              ))}

              {/* Main animated seal SVG */}
              <motion.svg
                viewBox="0 0 100 100"
                className="w-24 h-24 relative z-10"
                initial={{ scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="#064E3B"
                  stroke="#B48A3E"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="37"
                  fill="none"
                  stroke="#D4AF6A"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.path
                  d="M32 51 L45 64 L69 37"
                  fill="none"
                  stroke="#FBF9F5"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.28, ease: 'easeOut' }}
                />
              </motion.svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            >
              <h2
                id="success-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2"
              >
                {t.successTitle}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto mb-6">
                {request.syncedWithBackend ? t.successSyncedDesc : t.successLocalDesc}
              </p>

              {/* Official Reference Ticket */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 text-start">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <div className="text-xs text-stone-500 mb-0.5">{t.referenceNumber}</div>
                    <div className="font-mono-tabular text-lg font-semibold text-[#064E3B] tracking-wide">
                      {refCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t.copied : t.copyRef}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-stone-600">
                  <div>
                    <span className="text-stone-400 block">{t.fullName}</span>
                    <span className="font-medium text-stone-900">{request.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{t.country}</span>
                    <span className="font-medium text-stone-900">{request.countryName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{t.requestedAmount}</span>
                    <span className="font-mono-tabular font-semibold text-stone-900">
                      {formatCurrency(request.requestedAmount, request.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{t.tabLocalRequests}</span>
                    <span className="font-medium text-emerald-800">
                      {request.syncedWithBackend ? t.syncedLabel : t.pendingLocalLabel}
                    </span>
                  </div>
                </div>
              </div>

              {pdfError && (
                <p className="text-xs text-rose-700 mb-3" role="alert">
                  {pdfError}
                </p>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => void handleDownloadPdf()}
                  disabled={isGeneratingPdf}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#064E3B] bg-white hover:bg-stone-50 border border-[#B48A3E] rounded-lg transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isGeneratingPdf ? t.generatingPdf : t.downloadPdfReceipt}</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onTrack(refCode)}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#053e2f] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t.trackNow}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onNewRequest}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>{t.submitAnother}</span>
                    <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Off-screen formal A4 receipt template (strict hex/rgb styles for html2canvas compatibility) */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          <div
            ref={receiptRef}
            dir={isRtl ? 'rtl' : 'ltr'}
            style={{
              width: '794px',
              backgroundColor: '#FFFFFF',
              color: '#1C1917',
              fontFamily: "'Cairo', system-ui, -apple-system, sans-serif",
              padding: '36px',
              boxSizing: 'border-box',
              border: '1px solid #E7E5E4',
            }}
          >
            {/* Official Header Banner */}
            <div
              style={{
                backgroundColor: '#042F2E',
                color: '#FFFFFF',
                padding: '24px 28px',
                borderRadius: '12px',
                borderBottom: '4px solid #B48A3E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#E7C680',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  {t.pdfReceiptHeader}
                </div>
                <div
                  style={{
                    fontFamily: "'Amiri', Georgia, serif",
                    fontSize: '26px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                  }}
                >
                  {t.brandName}
                </div>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#064E3B',
                  border: '2px solid #B48A3E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#FBF9F5"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Reference & Metadata Strip */}
            <div
              style={{
                backgroundColor: '#FBF9F5',
                border: '1px solid #D6D3D1',
                borderRadius: '10px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '22px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '4px' }}>
                  {t.referenceNumber}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#064E3B',
                  }}
                >
                  {refCode}
                </div>
              </div>
              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '4px' }}>
                  {t.pdfReceiptIssuedAt}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1C1917',
                    marginBottom: '4px',
                  }}
                >
                  {issuedDate}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    backgroundColor: request.syncedWithBackend ? '#ECFDF5' : '#FFFBEB',
                    color: request.syncedWithBackend ? '#064E3B' : '#92400E',
                    border: `1px solid ${request.syncedWithBackend ? '#A7F3D0' : '#FDE68A'}`,
                  }}
                >
                  {request.syncedWithBackend ? t.syncedLabel : t.pendingLocalLabel}
                </div>
              </div>
            </div>

            {/* Applicant & Assistance Details Table */}
            <div
              style={{
                border: '1px solid #E7E5E4',
                borderRadius: '10px',
                padding: '20px 22px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#064E3B',
                  paddingBottom: '10px',
                  marginBottom: '14px',
                  borderBottom: '1px solid #E7E5E4',
                }}
              >
                {t.sectionApplicant} &amp; {t.sectionAidDetails}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px 24px',
                  fontSize: '13px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.fullName}</div>
                  <div style={{ fontWeight: 600, color: '#1C1917' }}>{request.applicantName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.nationalId}</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      color: '#1C1917',
                    }}
                  >
                    {request.nationalId}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>
                    {t.country} / {t.city}
                  </div>
                  <div style={{ fontWeight: 600, color: '#1C1917' }}>
                    {request.countryName} · {request.city}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.phone}</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      color: '#1C1917',
                    }}
                  >
                    {request.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.email}</div>
                  <div style={{ fontWeight: 600, color: '#1C1917' }}>{request.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.aidType}</div>
                  <div style={{ fontWeight: 600, color: '#1C1917', textTransform: 'capitalize' }}>
                    {request.aidType}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.requestedAmount}</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      color: '#064E3B',
                      fontSize: '15px',
                    }}
                  >
                    {formatCurrency(request.requestedAmount, request.currency)}
                    <span style={{ fontSize: '11px', color: '#78716C', fontWeight: 500 }}>
                      {' '}
                      (≈ ${request.amountUsdEquivalent.toLocaleString()} USD)
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>{t.payoutMethod}</div>
                  <div style={{ fontWeight: 600, color: '#1C1917' }}>
                    {payoutLabel}
                    {request.digitalWallet.provider ? ` · ${request.digitalWallet.provider}` : ''}
                    {request.bankAccount.bankName ? ` · ${request.bankAccount.bankName}` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Case Narrative */}
            <div
              style={{
                border: '1px solid #E7E5E4',
                borderRadius: '10px',
                padding: '16px 22px',
                backgroundColor: '#FAFAF9',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '6px' }}>
                {t.reason}
              </div>
              <div style={{ fontSize: '13px', color: '#292524', lineHeight: 1.65 }}>
                {request.reason}
              </div>
            </div>

            {/* Official Footer */}
            <div
              style={{
                borderTop: '2px solid #E7E5E4',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '11px',
                color: '#57534E',
              }}
            >
              <div>{t.pdfReceiptNote}</div>
              <div style={{ fontWeight: 600, color: '#064E3B' }}>{t.footerRights}</div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}

import type { Language } from '../types/aid';

export interface Translations {
  brandName: string;
  navHome: string;
  navApply: string;
  navTrack: string;
  navAdmin: string;
  primaryCta: string;
  printDocument: string;
  syncStatusOnline: string;
  syncStatusOffline: string;
  syncStatusOnlineTooltip: string;
  syncStatusOfflineTooltip: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroApplyBtn: string;
  heroTrackBtn: string;
  entryKicker: string;
  entryTitle: string;
  entrySubtitle: string;
  entryApplyBtn: string;
  entryTrackBtn: string;
  entryExploreProjects: string;
  globalReachTitle: string;
  globalReachSubtitle: string;
  statCountriesLabel: string;
  statRegionsLabel: string;
  statSyncLabel: string;
  statDirectivesLabel: string;
  programsTitle: string;
  programsSubtitle: string;
  charterTitle: string;
  charterBody: string;
  applyTitle: string;
  applySubtitle: string;
  sectionApplicant: string;
  sectionAidDetails: string;
  sectionPayout: string;
  fullName: string;
  nationalId: string;
  country: string;
  countrySearchPlaceholder: string;
  otherCountryOption: string;
  customCountry: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  aidType: string;
  urgency: string;
  urgencyNormal: string;
  urgencyUrgent: string;
  urgencyCritical: string;
  requestedAmount: string;
  currency: string;
  usdEstimate: string;
  reason: string;
  payoutMethod: string;
  payoutWallet: string;
  payoutBank: string;
  payoutBoth: string;
  walletProvider: string;
  customWalletOption: string;
  customWalletName: string;
  walletPhone: string;
  walletEmail: string;
  walletPassword: string;
  bankName: string;
  ibanOrAccount: string;
  swiftCode: string;
  cardFront: string;
  cardBack: string;
  uploadFront: string;
  uploadBack: string;
  submitAndSync: string;
  saveLocalOffline: string;
  submitting: string;
  successTitle: string;
  successSyncedDesc: string;
  successLocalDesc: string;
  referenceNumber: string;
  copyRef: string;
  copied: string;
  trackNow: string;
  submitAnother: string;
  close: string;
  downloadPdfReceipt: string;
  generatingPdf: string;
  pdfReceiptHeader: string;
  pdfReceiptIssuedAt: string;
  pdfReceiptNote: string;
  pdfReceiptError: string;
  trackTitle: string;
  trackSubtitle: string;
  trackPlaceholder: string;
  trackSearchBtn: string;
  trackNotFound: string;
  recentSearches: string;
  clearRecentSearches: string;
  timelineTitle: string;
  timelineStageReceived: string;
  timelineStageReceivedDesc: string;
  timelineStageReviewing: string;
  timelineStageReviewingDesc: string;
  timelineStageApproved: string;
  timelineStageApprovedDesc: string;
  timelineStageDisbursed: string;
  timelineStageDisbursedDesc: string;
  timelineStageRejected: string;
  timelineStatusCompleted: string;
  timelineStatusCurrent: string;
  timelineStatusPending: string;
  timelineUpdatedAt: string;
  timelineAdminNote: string;
  adminTitle: string;
  adminSubtitle: string;
  tabRequests: string;
  tabOrders: string;
  tabDirectives: string;
  tabLocalRequests: string;
  syncAllPending: string;
  syncOne: string;
  syncedLabel: string;
  pendingLocalLabel: string;
  failedLabel: string;
  issueOrder: string;
  createDirective: string;
  revealPassword: string;
  hidePassword: string;
  approveWallet: string;
  disburseFunds: string;
  verifyCard: string;
  cardVerified: string;
  cardPending: string;
  printOrder: string;
  exportCsv: string;
  copyOrder: string;
  tabAccessLogs: string;
  adminLockTitle: string;
  adminLockSubtitle: string;
  adminPasswordPlaceholder: string;
  adminUnlockBtn: string;
  adminInvalidPassword: string;
  adminLockBtn: string;
  confirmCardUpdated: string;
  confirmWalletApproved: string;
  confirmDisbursedOrder: string;
  confirmOrderIssued: string;
  confirmDirectiveSaved: string;
  confirmSynced: string;
  actionFailed: string;
  footerRights: string;
  footerGlobalNote: string;
  downloadHtmlApp: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ar: {
    brandName: 'مكتب الأمير طلال للمساعدة العالمية',
    navHome: 'الرئيسية',
    navApply: 'تقديم طلب',
    navTrack: 'تتبع الطلب',
    navAdmin: 'بوابة الإدارة',
    primaryCta: 'طلب مساعدة',
    printDocument: 'طباعة',
    syncStatusOnline: 'متصل للمزامنة',
    syncStatusOffline: 'غير متصل',
    syncStatusOnlineTooltip: 'خدمة المزامنة متاحة — يتم حفظ الطلبات محلياً ومزامنتها فورياً',
    syncStatusOfflineTooltip: 'وضع عدم الاتصال — يتم حفظ الطلبات محلياً ويمكن مزامنتها عند عودة الاتصال',
    heroTitle: 'مشاريع الوليد الجديدة لمساعدة المحتاجين',
    heroSubtitle: 'نبني الأمل معاً لمستقبل مشرق حول العالم',
    heroDescription:
      'منصة إنسانية دولية تتيح للمستفيدين في جميع دول العالم تقديم طلبات الدعم الطبي والسكني والتعليمي والإغاثي بشفافية تامة، مع حفظ محلي آمن ومزامنة فورية مع السجل المركزي وبوابة الأوامر الملكية.',
    heroApplyBtn: 'تقديم طلب مساعدة',
    heroTrackBtn: 'تتبع حالة الطلب',
    entryKicker: 'مشاريع الوليد للإنسانية للمساعدات المحتاجين',
    entryTitle: 'مؤسسة الوليد للإنسانية',
    entrySubtitle: 'نبني الأمل معاً لمستقبل مشرق',
    entryApplyBtn: 'تقديم طلب',
    entryTrackBtn: 'متابعة طلبك',
    entryExploreProjects: 'مشاريعنا',
    globalReachTitle: 'التغطية الإنسانية العالمية',
    globalReachSubtitle: 'استقبال الطلبات وصرف المساعدات بمختلف العملات والمحافظ الدولية عبر خمس قارات',
    statCountriesLabel: 'دولة وإقليم مشمولة',
    statRegionsLabel: 'أقاليم عالمية نشطة',
    statSyncLabel: 'حفظ محلي ومزامنة فورية',
    statDirectivesLabel: 'ضوابط تنفيذية فعالة',
    programsTitle: 'برامج الدعم العالمية المعتمدة',
    programsSubtitle: 'مسارات إنسانية مصممة للاستجابة السريعة لاحتياجات الأسر والأفراد عبر الحدود',
    charterTitle: 'الميثاق الإداري والشفافية المالية',
    charterBody:
      'يخضع كل طلب مساعدة لتدقيق إنساني ومالي مزدوج عبر بوابة المراجعة الإدارية، مع التحقق من بيانات المستفيد ووسيلة الصرف وإصدار أمر ملكي وإداري موثق برقم مرجعي قابل للتتبع عالمياً.',
    applyTitle: 'نموذج طلب المساعدة العالمي',
    applySubtitle: 'املأ البيانات بدقة لضمان سرعة المراجعة والصرف بالعملة والقناة المناسبة لبلدك',
    sectionApplicant: '01. بيانات مقدم الطلب والعنوان الدولي',
    sectionAidDetails: '02. تفاصيل المساعدة والعملة',
    sectionPayout: '03. إعدادات الصرف والتحقق (المحفظة الرقمية والحساب المصرفي)',
    fullName: 'الاسم الكامل (كما في الهوية أو جواز السفر)',
    nationalId: 'رقم الهوية الوطنية أو جواز السفر',
    country: 'الدولة',
    countrySearchPlaceholder: 'ابحث عن الدولة بالاسم أو الرمز (مثل: SA, Egypt, فرنسا)...',
    otherCountryOption: 'دولة / إقليم آخر غير مدرج...',
    customCountry: 'اسم الدولة أو الإقليم',
    city: 'المدينة / المحافظة',
    address: 'العنوان السكني الكامل',
    phone: 'رقم الهاتف الدولي',
    email: 'البريد الإلكتروني',
    aidType: 'نوع المساعدة المطلوبة',
    urgency: 'درجة الاستعجال',
    urgencyNormal: 'عادي',
    urgencyUrgent: 'عاجل',
    urgencyCritical: 'حرج وطارئ',
    requestedAmount: 'المبلغ المطلوب',
    currency: 'العملة',
    usdEstimate: 'المعادل التقديري بالدولار الأمريكي',
    reason: 'شرح الحالة وأسباب طلب المساعدة',
    payoutMethod: 'قناة استلام المساعدة',
    payoutWallet: 'محفظة رقمية',
    payoutBank: 'حساب مصرفي / بطاقة',
    payoutBoth: 'المحفظة الرقمية والحساب المصرفي معاً',
    walletProvider: 'مزود المحفظة الرقمية',
    customWalletOption: 'محفظة رقمية محلية / دولية أخرى...',
    customWalletName: 'اسم مزود المحفظة الرقمية',
    walletPhone: 'رقم هاتف المحفظة',
    walletEmail: 'البريد الإلكتروني للمحفظة',
    walletPassword: 'كلمة مرور / رمز أمان المحفظة (للتحقق الإداري)',
    bankName: 'اسم البنك',
    ibanOrAccount: 'رقم الحساب / IBAN',
    swiftCode: 'رمز SWIFT / BIC (للتحويلات الدولية)',
    cardFront: 'صورة الوجه الأمامي لبطاقة البنك',
    cardBack: 'صورة الوجه الخلفي لبطاقة البنك',
    uploadFront: 'رفع الوجه الأمامي',
    uploadBack: 'رفع الوجه الخلفي',
    submitAndSync: 'إرسال الطلب والمزامنة العالمية',
    saveLocalOffline: 'حفظ محلياً (للمناطق ضعيفة الاتصال)',
    submitting: 'جاري تسجيل الطلب ومزامنته...',
    successTitle: 'تم استلام طلب المساعدة بنجاح',
    successSyncedDesc: 'تم حفظ طلبك محلياً ومزامنته بنجاح مع السجل العالمي لمكتب الأمير طلال للمساعدة.',
    successLocalDesc: 'تم حفظ طلبك في قاعدة البيانات المحلية بنجاح، ويمكنك مزامنته مع السجل المركزي عند توفر الاتصال.',
    referenceNumber: 'الرقم المرجعي للطلب',
    copyRef: 'نسخ الرقم',
    copied: 'تم النسخ',
    trackNow: 'تتبع الطلب الآن',
    submitAnother: 'تقديم طلب جديد',
    close: 'إغلاق',
    downloadPdfReceipt: 'تحميل الإيصال الرسمي (PDF)',
    generatingPdf: 'جاري إنشاء ملف PDF...',
    pdfReceiptHeader: 'إيصال تسجيل طلب مساعدة إنسانية رسمي',
    pdfReceiptIssuedAt: 'تاريخ الإصدار',
    pdfReceiptNote: 'وثيقة إلكترونية صادرة عن السجل المركزي لمكتب الأمير طلال للمساعدة العالمية. يرجى الاحتفاظ بالرقم المرجعي لمتابعة حالة الطلب.',
    pdfReceiptError: 'تعذر إنشاء ملف PDF حالياً. يرجى المحاولة مرة أخرى.',
    trackTitle: 'تتبع حالة طلب المساعدة',
    trackSubtitle: 'أدخل الرقم المرجعي (REF-...) أو رقم الهوية/الجواز أو معرف الطلب المحلي',
    trackPlaceholder: 'مثال: REF-2026-8410 أو رقم الهوية',
    trackSearchBtn: 'بحث عن الطلب',
    trackNotFound: 'لم يتم العثور على طلب مطابق لهذا الرقم المرجعي أو الهوية.',
    recentSearches: 'عمليات البحث الأخيرة',
    clearRecentSearches: 'مسح السجل',
    timelineTitle: 'مراحل تقدم طلب المساعدة',
    timelineStageReceived: 'تم الاستلام',
    timelineStageReceivedDesc: 'تم تسجيل الطلب في النظام وتوليد الرقم المرجعي',
    timelineStageReviewing: 'قيد المراجعة',
    timelineStageReviewingDesc: 'التدقيق الإداري والتحقق من أهلية الحالة',
    timelineStageApproved: 'تمت الموافقة',
    timelineStageApprovedDesc: 'اعتماد بيانات المستفيد وقناة الصرف البنكية/الرقمية',
    timelineStageDisbursed: 'تم الصرف',
    timelineStageDisbursedDesc: 'إصدار الأمر الملكي وإتمام تحويل المساعدة',
    timelineStageRejected: 'مرفوض',
    timelineStatusCompleted: 'مكتمل',
    timelineStatusCurrent: 'المرحلة الحالية',
    timelineStatusPending: 'بانتظار الإجراء',
    timelineUpdatedAt: 'آخر تحديث',
    timelineAdminNote: 'ملاحظة المراجعة الإدارية',
    adminTitle: 'بوابة المراجعة الإدارية والأوامر الملكية',
    adminSubtitle: 'إدارة طلبات المستفيدين العالمية، التحقق من البطاقات والمحافظ، وإصدار الأوامر والتوجيهات التنفيذية',
    tabRequests: 'طلبات المساعدة',
    tabOrders: 'الأوامر الملكية والصرف',
    tabDirectives: 'التعليمات والضوابط',
    tabLocalRequests: 'الطلبات المحلية',
    syncAllPending: 'مزامنة جميع المعلقات',
    syncOne: 'مزامنة للخادم',
    syncedLabel: 'متزامن مع الخادم',
    pendingLocalLabel: 'معلق محلياً',
    failedLabel: 'فشلت المزامنة',
    issueOrder: 'إصدار أمر ملكي / إداري',
    createDirective: 'إضافة توجيه تنفيذي',
    revealPassword: 'كشف كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    approveWallet: 'اعتماد المحفظة',
    disburseFunds: 'صرف المساعدة وإصدار أمر',
    verifyCard: 'اعتماد مطابقة البطاقة',
    cardVerified: 'بطاقة معتمدة ومطابقة',
    cardPending: 'بانتظار مطابقة البطاقة',
    printOrder: 'طباعة / مشاركة الأمر',
    exportCsv: 'تصدير CSV',
    copyOrder: 'نسخ رقم الأمر',
    tabAccessLogs: 'سجل الدخول والصور',
    adminLockTitle: 'بوابة الإدارة المحمية',
    adminLockSubtitle: 'يرجى إدخال كلمة المرور الإدارية للوصول إلى الطلبات والصور المحفوظة وسجلات الدخول.',
    adminPasswordPlaceholder: 'أدخل كلمة مرور الإدارة',
    adminUnlockBtn: 'فتح بوابة الإدارة',
    adminInvalidPassword: 'كلمة المرور غير صحيحة. تم تسجيل محاولة الدخول.',
    adminLockBtn: 'قفل البوابة',
    confirmCardUpdated: 'تم تأكيد تحديث مطابقة البطاقة المصرفية وتسجيله في السجل.',
    confirmWalletApproved: 'تم تأكيد اعتماد المحفظة الرقمية وتسجيل الإجراء في السجل.',
    confirmDisbursedOrder: 'تم تأكيد الصرف وتسجيل الأمر الإداري/الملكي رسمياً.',
    confirmOrderIssued: 'تم تأكيد تسجيل الأمر الإداري/الملكي وحفظه في السجل.',
    confirmDirectiveSaved: 'تم تأكيد حفظ التوجيه التنفيذي وتسجيله في السجل.',
    confirmSynced: 'تم تأكيد مزامنة الطلبات المحلية وتسجيلها في السجل المركزي.',
    actionFailed: 'تعذر إتمام الإجراء وتأكيد التسجيل. يرجى التحقق من الاتصال أو صلاحية الدخول.',
    footerRights: 'مكتب الأمير طلال للمساعدة العالمية · مشاريع الوليد الإنسانية',
    footerGlobalNote: 'متاح لجميع الدول والعملات مع دعم الحفظ المحلي والمزامنة الدولية',
    downloadHtmlApp: 'تحميل البرنامج (HTML)',
  },
  en: {
    brandName: 'Prince Talal Global Aid Office',
    navHome: 'Home',
    navApply: 'Apply for Aid',
    navTrack: 'Track Request',
    navAdmin: 'Admin Portal',
    primaryCta: 'Request Aid',
    printDocument: 'Print',
    syncStatusOnline: 'Sync Online',
    syncStatusOffline: 'Offline',
    syncStatusOnlineTooltip: 'Sync service available — requests are saved locally and synced automatically',
    syncStatusOfflineTooltip: 'Offline mode — requests are saved locally and can be synced once reconnected',
    heroTitle: 'Al-Waleed New Humanitarian Projects Worldwide',
    heroSubtitle: 'Building Hope Together for a Brighter Global Future',
    heroDescription:
      'An international humanitarian intake and disbursement portal enabling families and individuals across every country to apply for medical, housing, educational, and emergency assistance with local-first resilience and instant global registry synchronization.',
    heroApplyBtn: 'Submit Aid Request',
    heroTrackBtn: 'Track Request Status',
    entryKicker: 'Al-Waleed Humanitarian Projects for Those in Need',
    entryTitle: 'Al-Waleed Philanthropies',
    entrySubtitle: 'Building Hope Together for a Brighter Future',
    entryApplyBtn: 'Submit Request',
    entryTrackBtn: 'Track Your Request',
    entryExploreProjects: 'Our Projects',
    globalReachTitle: 'Global Humanitarian Coverage',
    globalReachSubtitle: 'Accepting requests and disbursing aid across currencies and international wallets on five continents',
    statCountriesLabel: 'Countries & Territories',
    statRegionsLabel: 'Active Global Regions',
    statSyncLabel: 'Local-First & Cloud Sync',
    statDirectivesLabel: 'Active Executive Directives',
    programsTitle: 'Approved Global Aid Programs',
    programsSubtitle: 'Structured humanitarian tracks designed for rapid cross-border family and emergency relief',
    charterTitle: 'Administrative Charter & Financial Transparency',
    charterBody:
      'Every aid application undergoes dual humanitarian and payout verification inside the Admin Review Portal, validating identity, card/wallet channels, and issuing a globally trackable Royal & Administrative Order.',
    applyTitle: 'Global Humanitarian Aid Application',
    applySubtitle: 'Complete all fields accurately to expedite review and disbursement in your local currency and payout channel',
    sectionApplicant: '01. Applicant Profile & International Address',
    sectionAidDetails: '02. Assistance Category & Currency',
    sectionPayout: '03. Payout Settings & Verification (Digital Wallet & Bank Account)',
    fullName: 'Full Legal Name (as on National ID or Passport)',
    nationalId: 'National ID or Passport Number',
    country: 'Country',
    countrySearchPlaceholder: 'Filter country by name or code (e.g. US, Jordan, JP)...',
    otherCountryOption: 'Other Country / Territory...',
    customCountry: 'Custom Country / Territory Name',
    city: 'City / Province',
    address: 'Full Residential Address',
    phone: 'International Phone Number',
    email: 'Email Address',
    aidType: 'Type of Assistance',
    urgency: 'Urgency Level',
    urgencyNormal: 'Standard',
    urgencyUrgent: 'Urgent',
    urgencyCritical: 'Critical Emergency',
    requestedAmount: 'Requested Amount',
    currency: 'Currency',
    usdEstimate: 'Estimated USD Equivalent',
    reason: 'Case Narrative & Reason for Assistance',
    payoutMethod: 'Preferred Payout Channel',
    payoutWallet: 'Digital Wallet',
    payoutBank: 'Bank Account / Card',
    payoutBoth: 'Both Digital Wallet & Bank Account',
    walletProvider: 'Digital Wallet Provider',
    customWalletOption: 'Other Local / Global Digital Wallet...',
    customWalletName: 'Enter Digital Wallet Provider Name',
    walletPhone: 'Wallet Phone Number',
    walletEmail: 'Wallet Email',
    walletPassword: 'Wallet Verification Passcode / Password',
    bankName: 'Bank Name',
    ibanOrAccount: 'Account Number / IBAN',
    swiftCode: 'SWIFT / BIC Code (International Transfers)',
    cardFront: 'Bank Card Front Image',
    cardBack: 'Bank Card Back Image',
    uploadFront: 'Upload Front Side',
    uploadBack: 'Upload Back Side',
    submitAndSync: 'Submit & Sync Globally',
    saveLocalOffline: 'Save Locally (Low-Connectivity Mode)',
    submitting: 'Submitting and synchronizing...',
    successTitle: 'Aid Request Submitted Successfully',
    successSyncedDesc: 'Your application has been persisted locally and synchronized with the Prince Talal Global Aid Registry.',
    successLocalDesc: 'Your application has been saved to the local repository and can be synced to the central registry anytime.',
    referenceNumber: 'Global Reference Number',
    copyRef: 'Copy Reference',
    copied: 'Copied',
    trackNow: 'Track Request Now',
    submitAnother: 'Submit Another Request',
    close: 'Close',
    downloadPdfReceipt: 'Download Official Receipt (PDF)',
    generatingPdf: 'Generating PDF...',
    pdfReceiptHeader: 'Official Humanitarian Aid Application Receipt',
    pdfReceiptIssuedAt: 'Date Issued',
    pdfReceiptNote: 'Electronic receipt issued by the Prince Talal Global Aid Office Registry. Please retain your reference number to track application progress.',
    pdfReceiptError: 'Could not generate the PDF receipt right now. Please try again.',
    trackTitle: 'Track Aid Application Status',
    trackSubtitle: 'Enter your Reference Number (REF-...), National ID / Passport, or Local Request ID',
    trackPlaceholder: 'e.g. REF-2026-8410 or ID number',
    trackSearchBtn: 'Search Registry',
    trackNotFound: 'No matching application found for that reference number or ID.',
    recentSearches: 'Recent Searches',
    clearRecentSearches: 'Clear History',
    timelineTitle: 'Aid Request Progress Timeline',
    timelineStageReceived: 'Received',
    timelineStageReceivedDesc: 'Application logged and reference number assigned',
    timelineStageReviewing: 'Reviewing',
    timelineStageReviewingDesc: 'Administrative audit and humanitarian eligibility check',
    timelineStageApproved: 'Approved',
    timelineStageApprovedDesc: 'Beneficiary dossier and payout channel verified',
    timelineStageDisbursed: 'Disbursed',
    timelineStageDisbursedDesc: 'Official order issued and funds disbursed',
    timelineStageRejected: 'Declined',
    timelineStatusCompleted: 'Completed',
    timelineStatusCurrent: 'Current Stage',
    timelineStatusPending: 'Upcoming',
    timelineUpdatedAt: 'Last updated',
    timelineAdminNote: 'Administrative Review Note',
    adminTitle: 'Administrative Review & Royal Orders Portal',
    adminSubtitle: 'Audit global beneficiary dossiers, verify bank cards and wallets, and issue Royal Orders and Executive Directives',
    tabRequests: 'Aid Requests',
    tabOrders: 'Royal & Admin Orders',
    tabDirectives: 'Directives & Policies',
    tabLocalRequests: 'Local Requests',
    syncAllPending: 'Sync All Pending',
    syncOne: 'Sync to Backend',
    syncedLabel: 'Synced with Backend',
    pendingLocalLabel: 'Pending Local',
    failedLabel: 'Sync Failed',
    issueOrder: 'Issue Royal / Admin Order',
    createDirective: 'New Directive',
    revealPassword: 'Reveal Password',
    hidePassword: 'Hide Password',
    approveWallet: 'Approve Wallet',
    disburseFunds: 'Disburse & Issue Order',
    verifyCard: 'Verify Front & Back Card',
    cardVerified: 'Card Verified',
    cardPending: 'Pending Card Verification',
    printOrder: 'Print / Share Order',
    exportCsv: 'Export CSV',
    copyOrder: 'Copy Order Number',
    tabAccessLogs: 'Access & Saved Images',
    adminLockTitle: 'Protected Admin Portal',
    adminLockSubtitle: 'Enter the administrative password to access beneficiary dossiers, saved card images, and access logs.',
    adminPasswordPlaceholder: 'Enter admin password',
    adminUnlockBtn: 'Unlock Admin Portal',
    adminInvalidPassword: 'Incorrect password. This attempt has been recorded.',
    adminLockBtn: 'Lock Portal',
    confirmCardUpdated: 'Bank card verification confirmed and recorded in the audit log.',
    confirmWalletApproved: 'Digital wallet approval confirmed and logged.',
    confirmDisbursedOrder: 'Disbursement confirmed and official Order registered.',
    confirmOrderIssued: 'Royal / Admin Order registration confirmed and logged.',
    confirmDirectiveSaved: 'Executive directive saved and recorded in the audit log.',
    confirmSynced: 'Local request synchronization confirmed and logged.',
    actionFailed: 'Could not complete and register the action. Check connection or admin session.',
    footerRights: 'Prince Talal Global Aid Office · Al-Waleed Humanitarian Projects',
    footerGlobalNote: 'Open worldwide across all countries and currencies with local-first resilience',
    downloadHtmlApp: 'Download HTML App',
  },
  fr: {
    brandName: 'Bureau d’Aide Mondiale Prince Talal',
    navHome: 'Accueil',
    navApply: 'Demander une Aide',
    navTrack: 'Suivre un Dossier',
    navAdmin: 'Portail Admin',
    primaryCta: 'Demander',
    printDocument: 'Imprimer',
    syncStatusOnline: 'Sync en ligne',
    syncStatusOffline: 'Hors ligne',
    syncStatusOnlineTooltip: 'Service de synchronisation disponible — enregistrement local et synchronisation immédiate',
    syncStatusOfflineTooltip: 'Mode hors ligne — les demandes sont enregistrées localement en attendant la reconnexion',
    heroTitle: 'Nouveaux Projets Humanitaires Al-Waleed dans le Monde',
    heroSubtitle: 'Bâtir l’Espoir Ensemble pour un Avenir Meilleur',
    heroDescription:
      'Plateforme humanitaire internationale permettant aux bénéficiaires de tous les pays de soumettre des demandes d’aide médicale, de logement, d’éducation et d’urgence avec sauvegarde locale et synchronisation mondiale immédiate.',
    heroApplyBtn: 'Soumettre une Demande',
    heroTrackBtn: 'Suivre mon Dossier',
    entryKicker: 'Projets Humanitaires Al-Waleed pour les Personnes dans le Besoin',
    entryTitle: 'Fondation Al-Waleed pour l’Humanitaire',
    entrySubtitle: 'Bâtir l’Espoir Ensemble pour un Avenir Meilleur',
    entryApplyBtn: 'Soumettre une Demande',
    entryTrackBtn: 'Suivre votre Dossier',
    entryExploreProjects: 'Nos Projets',
    globalReachTitle: 'Couverture Humanitaire Mondiale',
    globalReachSubtitle: 'Réception et versement des aides en devises locales et portefeuilles internationaux sur cinq continents',
    statCountriesLabel: 'Pays et Territoires',
    statRegionsLabel: 'Régions Actives',
    statSyncLabel: 'Stockage Local & Sync',
    statDirectivesLabel: 'Directives Actives',
    programsTitle: 'Programmes Mondiaux Approuvés',
    programsSubtitle: 'Parcours humanitaires structurés pour une réponse transfrontalière rapide',
    charterTitle: 'Charte Administrative et Transparence',
    charterBody:
      'Chaque demande fait l’objet d’une double vérification humaine et financière dans le portail administratif, suivie d’un ordre royal officiel traçable mondialement.',
    applyTitle: 'Formulaire Mondial de Demande d’Aide',
    applySubtitle: 'Veuillez remplir chaque section avec exactitude pour accélérer la validation et le versement',
    sectionApplicant: '01. Identité du Demandeur & Adresse Internationale',
    sectionAidDetails: '02. Catégorie d’Aide & Devise',
    sectionPayout: '03. Paramètres de Paiement & Vérification (Portefeuille & Banque)',
    fullName: 'Nom Complet (Pièce d’identité ou Passeport)',
    nationalId: 'Numéro d’Identité Nationale ou Passeport',
    country: 'Pays',
    countrySearchPlaceholder: 'Filtrer par nom ou code (ex. FR, Maroc, CA)...',
    otherCountryOption: 'Autre pays / territoire...',
    customCountry: 'Nom du pays / territoire',
    city: 'Ville / Province',
    address: 'Adresse Complète',
    phone: 'Téléphone International',
    email: 'Adresse E-mail',
    aidType: 'Type d’Assistance',
    urgency: 'Niveau d’Urgence',
    urgencyNormal: 'Standard',
    urgencyUrgent: 'Urgent',
    urgencyCritical: 'Critique',
    requestedAmount: 'Montant Demandé',
    currency: 'Devise',
    usdEstimate: 'Équivalent Estimé en USD',
    reason: 'Description de la Situation et Motif',
    payoutMethod: 'Canal de Versement',
    payoutWallet: 'Portefeuille Numérique',
    payoutBank: 'Compte Bancaire / Carte',
    payoutBoth: 'Portefeuille Numérique et Compte Bancaire',
    walletProvider: 'Fournisseur du Portefeuille',
    customWalletOption: 'Autre portefeuille numérique...',
    customWalletName: 'Nom du fournisseur du portefeuille',
    walletPhone: 'Téléphone du Portefeuille',
    walletEmail: 'E-mail du Portefeuille',
    walletPassword: 'Mot de passe de vérification du Portefeuille',
    bankName: 'Nom de la Banque',
    ibanOrAccount: 'Numéro de Compte / IBAN',
    swiftCode: 'Code SWIFT / BIC',
    cardFront: 'Recto de la Carte Bancaire',
    cardBack: 'Verso de la Carte Bancaire',
    uploadFront: 'Téléverser Recto',
    uploadBack: 'Téléverser Verso',
    submitAndSync: 'Soumettre & Synchroniser',
    saveLocalOffline: 'Enregistrer Localement (Hors ligne)',
    submitting: 'Enregistrement et synchronisation...',
    successTitle: 'Demande Envoyée avec Succès',
    successSyncedDesc: 'Votre dossier est enregistré localement et synchronisé avec le registre mondial.',
    successLocalDesc: 'Votre dossier est enregistré localement et prêt à être synchronisé.',
    referenceNumber: 'Numéro de Référence',
    copyRef: 'Copier',
    copied: 'Copié',
    trackNow: 'Suivre le Dossier',
    submitAnother: 'Nouvelle Demande',
    close: 'Fermer',
    downloadPdfReceipt: 'Télécharger le Reçu Officiel (PDF)',
    generatingPdf: 'Génération du PDF...',
    pdfReceiptHeader: 'Reçu Officiel d’Enregistrement de Demande d’Aide',
    pdfReceiptIssuedAt: 'Date d’émission',
    pdfReceiptNote: 'Reçu électronique délivré par le Registre du Bureau d’Aide Mondiale Prince Talal. Veuillez conserver votre numéro de référence pour suivre votre dossier.',
    pdfReceiptError: 'Impossible de générer le reçu PDF pour le moment. Veuillez réessayer.',
    trackTitle: 'Suivi de Demande d’Aide',
    trackSubtitle: 'Saisissez votre numéro de référence (REF-...), pièce d’identité ou ID local',
    trackPlaceholder: 'Ex: REF-2026-8410',
    trackSearchBtn: 'Rechercher',
    trackNotFound: 'Aucune demande correspondante trouvée.',
    recentSearches: 'Recherches récentes',
    clearRecentSearches: 'Effacer l’historique',
    timelineTitle: 'Progression de la Demande d’Aide',
    timelineStageReceived: 'Reçu',
    timelineStageReceivedDesc: 'Dossier enregistré avec numéro de référence',
    timelineStageReviewing: 'En Examen',
    timelineStageReviewingDesc: 'Audit administratif et vérification d’éligibilité',
    timelineStageApproved: 'Approuvé',
    timelineStageApprovedDesc: 'Bénéficiaire et canal de versement validés',
    timelineStageDisbursed: 'Versé',
    timelineStageDisbursedDesc: 'Ordre officiel émis et aide versée',
    timelineStageRejected: 'Refusé',
    timelineStatusCompleted: 'Terminé',
    timelineStatusCurrent: 'Étape Actuelle',
    timelineStatusPending: 'À venir',
    timelineUpdatedAt: 'Dernière mise à jour',
    timelineAdminNote: 'Note de Révision Administrative',
    adminTitle: 'Portail de Révision Administrative & Ordres Royaux',
    adminSubtitle: 'Examiner les dossiers mondiaux, vérifier cartes et portefeuilles, et émettre les ordres et directives',
    tabRequests: 'Demandes',
    tabOrders: 'Ordres Royaux',
    tabDirectives: 'Directives',
    tabLocalRequests: 'Dossiers Locaux',
    syncAllPending: 'Tout Synchroniser',
    syncOne: 'Synchroniser',
    syncedLabel: 'Synchronisé',
    pendingLocalLabel: 'En attente locale',
    failedLabel: 'Échec Sync',
    issueOrder: 'Émettre un Ordre',
    createDirective: 'Nouvelle Directive',
    revealPassword: 'Afficher le Mot de Passe',
    hidePassword: 'Masquer',
    approveWallet: 'Approuver Portefeuille',
    disburseFunds: 'Verser & Émettre Ordre',
    verifyCard: 'Valider Carte Recto/Verso',
    cardVerified: 'Carte Vérifiée',
    cardPending: 'Vérification en attente',
    printOrder: 'Imprimer / Partager',
    exportCsv: 'Exporter CSV',
    copyOrder: 'Copier N° Ordre',
    tabAccessLogs: 'Journaux & Images',
    adminLockTitle: 'Portail Admin Protégé',
    adminLockSubtitle: 'Saisissez le mot de passe administratif pour accéder aux dossiers, images sauvegardées et journaux.',
    adminPasswordPlaceholder: 'Mot de passe administrateur',
    adminUnlockBtn: 'Déverrouiller le Portail',
    adminInvalidPassword: 'Mot de passe incorrect. Tentative enregistrée.',
    adminLockBtn: 'Verrouiller',
    confirmCardUpdated: 'Vérification de carte confirmée et enregistrée dans le journal.',
    confirmWalletApproved: 'Approbation du portefeuille confirmée et enregistrée.',
    confirmDisbursedOrder: 'Versement confirmé et Ordre officiel enregistré.',
    confirmOrderIssued: 'Enregistrement de l’Ordre confirmé dans le registre.',
    confirmDirectiveSaved: 'Directive exécutive enregistrée et journalisée.',
    confirmSynced: 'Synchronisation locale confirmée et enregistrée.',
    actionFailed: 'Impossible d’enregistrer l’action. Vérifiez la connexion ou la session admin.',
    footerRights: 'Bureau d’Aide Mondiale Prince Talal · Projets Humanitaires Al-Waleed',
    footerGlobalNote: 'Disponible dans le monde entier avec résilience locale et synchronisation globale',
    downloadHtmlApp: 'Télécharger (HTML)',
  },
  es: {
    brandName: 'Oficina Global de Ayuda Príncipe Talal',
    navHome: 'Inicio',
    navApply: 'Solicitar Ayuda',
    navTrack: 'Rastrear Solicitud',
    navAdmin: 'Portal Admin',
    primaryCta: 'Solicitar',
    printDocument: 'Imprimir',
    syncStatusOnline: 'Sync activa',
    syncStatusOffline: 'Sin conexión',
    syncStatusOnlineTooltip: 'Servicio de sincronización disponible — las solicitudes se guardan y sincronizan al instante',
    syncStatusOfflineTooltip: 'Modo sin conexión — las solicitudes se guardan localmente hasta recuperar la conexión',
    heroTitle: 'Nuevos Proyectos Humanitarios Al-Waleed en el Mundo',
    heroSubtitle: 'Construyendo Esperanza Juntos para un Futuro Brillante',
    heroDescription:
      'Portal humanitario internacional que permite a familias e individuos de todo el mundo solicitar apoyo médico, habitacional, educativo y de emergencia con respaldo local y sincronización global inmediata.',
    heroApplyBtn: 'Enviar Solicitud',
    heroTrackBtn: 'Rastrear Estado',
    entryKicker: 'Proyectos Humanitarios Al-Waleed para Quienes Más lo Necesitan',
    entryTitle: 'Fundación Al-Waleed Humanitaria',
    entrySubtitle: 'Construyendo Esperanza Juntos para un Futuro Brillante',
    entryApplyBtn: 'Enviar Solicitud',
    entryTrackBtn: 'Seguir tu Solicitud',
    entryExploreProjects: 'Nuestros Proyectos',
    globalReachTitle: 'Cobertura Humanitaria Global',
    globalReachSubtitle: 'Recepción y desembolso en múltiples monedas y billeteras digitales en cinco continentes',
    statCountriesLabel: 'Países y Territorios',
    statRegionsLabel: 'Regiones Globales Activas',
    statSyncLabel: 'Respaldo Local y Nube',
    statDirectivesLabel: 'Directivas Activas',
    programsTitle: 'Programas Globales Aprobados',
    programsSubtitle: 'Líneas de asistencia humanitaria diseñadas para respuesta rápida transfronteriza',
    charterTitle: 'Estatuto Administrativo y Transparencia',
    charterBody:
      'Cada solicitud pasa por una doble verificación humanitaria y financiera en el portal de revisión administrativa, generando una Orden Real rastreable internacionalmente.',
    applyTitle: 'Formulario Global de Solicitud de Ayuda',
    applySubtitle: 'Complete todos los campos con precisión para agilizar la revisión y el desembolso',
    sectionApplicant: '01. Datos del Solicitante y Dirección Internacional',
    sectionAidDetails: '02. Categoría de Ayuda y Moneda',
    sectionPayout: '03. Datos de Pago y Verificación (Billetera Digital y Banco)',
    fullName: 'Nombre Completo (según Documento o Pasaporte)',
    nationalId: 'Documento Nacional o Pasaporte',
    country: 'País',
    countrySearchPlaceholder: 'Filtrar país por nombre o código (ej. ES, México)...',
    otherCountryOption: 'Otro país / territorio...',
    customCountry: 'Nombre del país / territorio',
    city: 'Ciudad / Provincia',
    address: 'Dirección Residencial Completa',
    phone: 'Teléfono Internacional',
    email: 'Correo Electrónico',
    aidType: 'Tipo de Asistencia',
    urgency: 'Nivel de Urgencia',
    urgencyNormal: 'Estándar',
    urgencyUrgent: 'Urgente',
    urgencyCritical: 'Emergencia Crítica',
    requestedAmount: 'Monto Solicitado',
    currency: 'Moneda',
    usdEstimate: 'Equivalente Estimado en USD',
    reason: 'Motivo y Descripción del Caso',
    payoutMethod: 'Canal de Recepción',
    payoutWallet: 'Billetera Digital',
    payoutBank: 'Cuenta Bancaria / Tarjeta',
    payoutBoth: 'Billetera Digital y Cuenta Bancaria',
    walletProvider: 'Proveedor de Billetera',
    customWalletOption: 'Otra billetera digital...',
    customWalletName: 'Nombre del proveedor de billetera',
    walletPhone: 'Teléfono de Billetera',
    walletEmail: 'Correo de Billetera',
    walletPassword: 'Clave de Verificación de Billetera',
    bankName: 'Nombre del Banco',
    ibanOrAccount: 'Número de Cuenta / IBAN',
    swiftCode: 'Código SWIFT / BIC',
    cardFront: 'Imagen Frontal de Tarjeta Bancaria',
    cardBack: 'Imagen Posterior de Tarjeta Bancaria',
    uploadFront: 'Subir Frontal',
    uploadBack: 'Subir Posterior',
    submitAndSync: 'Enviar y Sincronizar Globalmente',
    saveLocalOffline: 'Guardar Localmente (Sin conexión)',
    submitting: 'Enviando y sincronizando...',
    successTitle: 'Solicitud Enviada con Éxito',
    successSyncedDesc: 'Su solicitud se guardó localmente y se sincronizó con el registro global.',
    successLocalDesc: 'Su solicitud se guardó en el repositorio local y puede sincronizarse en cualquier momento.',
    referenceNumber: 'Número de Referencia',
    copyRef: 'Copiar',
    copied: 'Copiado',
    trackNow: 'Rastrear Ahora',
    submitAnother: 'Nueva Solicitud',
    close: 'Cerrar',
    downloadPdfReceipt: 'Descargar Recibo Oficial (PDF)',
    generatingPdf: 'Generando PDF...',
    pdfReceiptHeader: 'Recibo Oficial de Registro de Solicitud de Ayuda',
    pdfReceiptIssuedAt: 'Fecha de emisión',
    pdfReceiptNote: 'Recibo electrónico emitido por el Registro de la Oficina Global de Ayuda Príncipe Talal. Conserve su número de referencia para dar seguimiento.',
    pdfReceiptError: 'No se pudo generar el recibo PDF en este momento. Inténtelo de nuevo.',
    trackTitle: 'Rastrear Estado de Solicitud',
    trackSubtitle: 'Ingrese su número de referencia (REF-...), documento nacional o ID local',
    trackPlaceholder: 'Ej: REF-2026-8410',
    trackSearchBtn: 'Buscar',
    trackNotFound: 'No se encontró ninguna solicitud coincidente.',
    recentSearches: 'Búsquedas recientes',
    clearRecentSearches: 'Borrar historial',
    timelineTitle: 'Línea de Progreso de la Solicitud',
    timelineStageReceived: 'Recibido',
    timelineStageReceivedDesc: 'Solicitud registrada con número de referencia',
    timelineStageReviewing: 'En Revisión',
    timelineStageReviewingDesc: 'Auditoría administrativa y verificación de elegibilidad',
    timelineStageApproved: 'Aprobado',
    timelineStageApprovedDesc: 'Expediente y canal de pago verificados',
    timelineStageDisbursed: 'Desembolsado',
    timelineStageDisbursedDesc: 'Orden oficial emitida y fondos enviados',
    timelineStageRejected: 'Rechazado',
    timelineStatusCompleted: 'Completado',
    timelineStatusCurrent: 'Etapa Actual',
    timelineStatusPending: 'Pendiente',
    timelineUpdatedAt: 'Última actualización',
    timelineAdminNote: 'Nota de Revisión Administrativa',
    adminTitle: 'Portal de Revisión Administrativa y Órdenes Reales',
    adminSubtitle: 'Auditar expedientes globales, verificar tarjetas y billeteras, y emitir órdenes y directivas',
    tabRequests: 'Solicitudes',
    tabOrders: 'Órdenes Reales',
    tabDirectives: 'Directivas',
    tabLocalRequests: 'Solicitudes Locales',
    syncAllPending: 'Sincronizar Todo',
    syncOne: 'Sincronizar',
    syncedLabel: 'Sincronizado',
    pendingLocalLabel: 'Pendiente Local',
    failedLabel: 'Error de Sync',
    issueOrder: 'Emitir Orden Real',
    createDirective: 'Nueva Directiva',
    revealPassword: 'Mostrar Clave',
    hidePassword: 'Ocultar',
    approveWallet: 'Aprobar Billetera',
    disburseFunds: 'Desembolsar y Emitir Orden',
    verifyCard: 'Verificar Tarjeta Frontal/Posterior',
    cardVerified: 'Tarjeta Verificada',
    cardPending: 'Verificación Pendiente',
    printOrder: 'Imprimir / Compartir',
    exportCsv: 'Exportar CSV',
    copyOrder: 'Copiar N° Orden',
    tabAccessLogs: 'Registros e Imágenes',
    adminLockTitle: 'Portal Admin Protegido',
    adminLockSubtitle: 'Ingrese la contraseña administrativa para acceder a expedientes, imágenes guardadas y registros.',
    adminPasswordPlaceholder: 'Contraseña administrativa',
    adminUnlockBtn: 'Desbloquear Portal',
    adminInvalidPassword: 'Contraseña incorrecta. El intento fue registrado.',
    adminLockBtn: 'Bloquear Portal',
    confirmCardUpdated: 'Verificación de tarjeta confirmada y registrada en la bitácora.',
    confirmWalletApproved: 'Aprobación de billetera confirmada y registrada.',
    confirmDisbursedOrder: 'Desembolso confirmado y Orden oficial registrada.',
    confirmOrderIssued: 'Registro de Orden Real/Admin confirmado en la bitácora.',
    confirmDirectiveSaved: 'Directiva ejecutiva guardada y registrada.',
    confirmSynced: 'Sincronización local confirmada y registrada.',
    actionFailed: 'No se pudo completar ni registrar la acción. Verifique la conexión o sesión.',
    footerRights: 'Oficina Global de Ayuda Príncipe Talal · Proyectos Humanitarios Al-Waleed',
    footerGlobalNote: 'Disponible en todo el mundo con persistencia local y sincronización global',
    downloadHtmlApp: 'Descargar App (HTML)',
  },
};

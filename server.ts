import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const ADMIN_PASSWORD = process.env.ADMIN_PORTAL_PASSWORD || 'Starstalwlapp2026';

interface DatabaseState {
  requests: any[];
  orders: any[];
  directives: any[];
  accessLogs: any[];
}

function createInitialSeed(): DatabaseState {
  const now = new Date().toISOString();
  return {
    requests: [
      {
        id: 'REQ-SEED-1001',
        applicantName: 'علاء عبد الحسين الكاظمي',
        nationalId: 'IQ-1988402911',
        countryCode: 'IQ',
        countryName: 'العراق',
        city: 'بغداد',
        address: 'الكرادة الشرقية، شارع 52، محلة 903',
        phone: '+964 770 412 8891',
        email: 'alaa.kazemi@example.org',
        aidType: 'vehicle',
        reason: 'طلب دعم مركبة نقل طبية مجهزة لنقل المرضى في المناطق الطرفية وفق الضوابط التنفيذية المعتمدة.',
        requestedAmount: 8500,
        currency: 'USD',
        amountUsdEquivalent: 8500,
        urgencyLevel: 'urgent',
        payoutMethod: 'both',
        digitalWallet: {
          provider: 'Zain Cash',
          phone: '+964 770 412 8891',
          email: 'alaa.kazemi@example.org',
          password: 'ZC#8842-TALAL',
        },
        bankAccount: {
          bankName: 'المصرف العراقي للتجارة (TBI)',
          accountOrIban: 'IQ54 NBIQ 0001 4409 8210 123',
          swiftCode: 'NBIQIQBA',
          cardFrontImage: '',
          cardBackImage: '',
          cardVerified: true,
        },
        approvalStatus: 'DISBURSED',
        syncedWithBackend: true,
        syncStatus: 'SYNCED',
        backendRefNumber: 'REF-2026-1049',
        disbursedOrderNumber: 'ORD-TALAL-2026-1049',
        adminNotes: 'تمت المطابقة والتحقق من الأهلية وإصدار أمر الصرف الملكي رقم ORD-TALAL-2026-1049.',
        createdAt: '2026-11-10T09:15:00.000Z',
        updatedAt: now,
      },
      {
        id: 'REQ-SEED-1002',
        applicantName: 'Amira Hassan El-Sayed',
        nationalId: 'EG-29304152100481',
        countryCode: 'EG',
        countryName: 'مصر',
        city: 'القاهرة',
        address: 'المعادي الجديدة، شارع 14، بناية 8',
        phone: '+20 100 541 2290',
        email: 'amira.hassan@example.org',
        aidType: 'medical',
        reason: 'تغطية تكاليف جراحة قلبية عاجلة ورعاية ما بعد العملية لرب الأسرة.',
        requestedAmount: 145000,
        currency: 'EGP',
        amountUsdEquivalent: 2972.5,
        urgencyLevel: 'critical',
        payoutMethod: 'digital_wallet',
        digitalWallet: {
          provider: 'Vodafone Cash',
          phone: '+20 100 541 2290',
          email: 'amira.hassan@example.org',
          password: 'VF@2026-MED',
        },
        bankAccount: {
          bankName: 'البنك الأهلي المصري',
          accountOrIban: 'EG38 0019 0005 0000 0000 2631 8000 2',
          swiftCode: 'NBEGEGCX',
          cardFrontImage: '',
          cardBackImage: '',
          cardVerified: false,
        },
        approvalStatus: 'UNDER_REVIEW',
        syncedWithBackend: true,
        syncStatus: 'SYNCED',
        backendRefNumber: 'REF-2026-1054',
        disbursedOrderNumber: null,
        adminNotes: 'حالة حرجة قيد المراجعة الطبية السريعة.',
        createdAt: '2026-11-11T14:20:00.000Z',
        updatedAt: now,
      },
      {
        id: 'REQ-SEED-1003',
        applicantName: 'Grace Wanjiku Kamau',
        nationalId: 'KE-33910482',
        countryCode: 'KE',
        countryName: 'Kenya',
        city: 'Nairobi',
        address: 'Kilimani Road, Block 4, Unit 12',
        phone: '+254 712 883 410',
        email: 'grace.kamau@example.org',
        aidType: 'education',
        reason: 'University tuition and laboratory equipment grant for two orphaned medical students.',
        requestedAmount: 420000,
        currency: 'KES',
        amountUsdEquivalent: 3234,
        urgencyLevel: 'normal',
        payoutMethod: 'both',
        digitalWallet: {
          provider: 'M-Pesa',
          phone: '+254 712 883 410',
          email: 'grace.kamau@example.org',
          password: 'MP-KENYA-441',
        },
        bankAccount: {
          bankName: 'Equity Bank Kenya',
          accountOrIban: 'KE-0810293847561',
          swiftCode: 'EQBLKENA',
          cardFrontImage: '',
          cardBackImage: '',
          cardVerified: false,
        },
        approvalStatus: 'SUBMITTED',
        syncedWithBackend: true,
        syncStatus: 'SYNCED',
        backendRefNumber: 'REF-2026-1061',
        disbursedOrderNumber: null,
        adminNotes: '',
        createdAt: '2026-11-12T11:05:00.000Z',
        updatedAt: now,
      },
      {
        id: 'REQ-SEED-1004',
        applicantName: 'سلمان فهد الدوسري',
        nationalId: 'SA-1089442310',
        countryCode: 'SA',
        countryName: 'المملكة العربية السعودية',
        city: 'الرياض',
        address: 'حي النرجس، طريق الملك سلمان، منزل 24',
        phone: '+966 55 812 9903',
        email: 'salman.dosari@example.org',
        aidType: 'housing',
        reason: 'دعم ترميم مسكن أسرة متضررة وتوفير التجهيزات الأساسية للمعيشة الكريمة.',
        requestedAmount: 24000,
        currency: 'SAR',
        amountUsdEquivalent: 6398.4,
        urgencyLevel: 'urgent',
        payoutMethod: 'bank_account',
        digitalWallet: {
          provider: 'STC Pay',
          phone: '+966 55 812 9903',
          email: 'salman.dosari@example.org',
          password: 'STC#7721',
        },
        bankAccount: {
          bankName: 'مصرف الراجحي',
          accountOrIban: 'SA03 8000 0000 6080 1016 7519',
          swiftCode: 'RJHISARI',
          cardFrontImage: '',
          cardBackImage: '',
          cardVerified: true,
        },
        approvalStatus: 'WALLET_APPROVED',
        syncedWithBackend: true,
        syncStatus: 'SYNCED',
        backendRefNumber: 'REF-2026-1068',
        disbursedOrderNumber: null,
        adminNotes: 'تمت مطابقة الهوية والبطاقة المصرفية؛ جاهز للصرف.',
        createdAt: '2026-11-12T17:40:00.000Z',
        updatedAt: now,
      },
    ],
    orders: [
      {
        id: 'ORD-SEED-1',
        orderNumber: 'ORD-TALAL-2026-1049',
        requestId: 'REQ-SEED-1001',
        beneficiaryName: 'علاء عبد الحسين الكاظمي',
        countryName: 'العراق',
        amount: 8500,
        currency: 'USD',
        payoutChannel: 'Zain Cash + Bank Transfer (TBI)',
        title: 'أمر ملكي وإداري بصرف دعم مركبة إسعاف ونقل طبي',
        notes: 'صرف عاجل معتمد وفق ضوابط مساعدة المركبات في العراق وبعد استيفاء التحقق البنكي.',
        issuedBy: 'مكتب الأمير طلال للمساعدة العالمية',
        issuedAt: '2026-11-10T16:30:00.000Z',
        status: 'DISBURSED',
      },
      {
        id: 'ORD-SEED-2',
        orderNumber: 'ORD-TALAL-2026-1042',
        requestId: null,
        beneficiaryName: 'مبادرة الإغاثة الطبية العابرة للحدود',
        countryName: 'الأردن / فلسطين / السودان',
        amount: 50000,
        currency: 'USD',
        payoutChannel: 'International SWIFT Humanitarian Escrow',
        title: 'أمر صرف إغاثي عاجل لتأمين الإمدادات الطبية والأدوية المنقذة للحياة',
        notes: 'تنفيذ فوري عبر المنسقين الإقليميين وتوثيق فواتير التوريد.',
        issuedBy: 'الأمانة التنفيذية لمشاريع الوليد الإنسانية',
        issuedAt: '2026-11-08T10:00:00.000Z',
        status: 'DISBURSED',
      },
    ],
    directives: [
      {
        id: 'DIR-SEED-1',
        code: 'DIR-2026-01',
        title: 'ضوابط مساعدة المركبات والدعم الميداني (العراق والأقاليم)',
        category: 'vehicle_aid',
        content:
          'تُعتمد طلبات المركبات حصراً للحالات الطبية والإنسانية والأسر ذات الدخل المحدود، مع إلزامية مطابقة الهوية الوطنية والتحقق من قناة الاستلام المزدوجة وإصدار أمر صرف موثق.',
        appliesToCountries: 'العراق، الأردن، اليمن، سوريا، والدول ذات الاحتياج اللوجستي',
        priority: 'high',
        isActive: true,
        updatedAt: '2026-11-01T08:00:00.000Z',
      },
      {
        id: 'DIR-SEED-2',
        code: 'DIR-2026-02',
        title: 'سياسة مطابقة أمان المحفظة الرقمية والبطاقة المصرفية',
        category: 'wallet_security',
        content:
          'يتوجب على المراجع الإداري التحقق من وجهي بطاقة البنك (الأمامي والخلفي) ومطابقة رقم هاتف المحفظة الرقمية ورمز التحقق قبل اعتماد الصرف النهائي لأي عملة دولية.',
        appliesToCountries: 'جميع دول العالم (Global)',
        priority: 'high',
        isActive: true,
        updatedAt: '2026-11-04T12:00:00.000Z',
      },
      {
        id: 'DIR-SEED-3',
        code: 'DIR-2026-03',
        title: 'معايير الأولوية القصوى للحالات الطبية والطارئة العالمية',
        category: 'priority_criteria',
        content:
          'تُمنح الأولوية المطلقة خلال 24 ساعة للحالات المصنفة كـ (حرج وطارئ) في العمليات الجراحية العاجلة والإيواء الطارئ، مع دعم التحويل بالعملة المحلية أو الدولار الأمريكي.',
        appliesToCountries: 'جميع دول العالم (Global)',
        priority: 'high',
        isActive: true,
        updatedAt: '2026-11-06T09:30:00.000Z',
      },
    ],
    accessLogs: [
      {
        id: 'LOG-SEED-1',
        eventType: 'REQUEST_SUBMITTED',
        actorLabel: 'علاء عبد الحسين الكاظمي',
        details: 'تسجيل ومزامنة طلب مساعدة جديد (REF-2026-1049)',
        countryOrLang: 'العراق · AR',
        userAgent: 'System Seed Registry',
        createdAt: '2026-11-10T09:15:00.000Z',
      },
    ],
  };
}

function ensureDirectories(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function loadDb(): DatabaseState {
  ensureDirectories();
  if (!fs.existsSync(DB_PATH)) {
    const seed = createInitialSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseState>;
    return {
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      directives: Array.isArray(parsed.directives) ? parsed.directives : [],
      accessLogs: Array.isArray(parsed.accessLogs) ? parsed.accessLogs : [],
    };
  } catch {
    const seed = createInitialSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function saveDb(state: DatabaseState): void {
  ensureDirectories();
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

function appendAccessLog(
  db: DatabaseState,
  entry: {
    eventType: string;
    actorLabel: string;
    details: string;
    countryOrLang: string;
    userAgent: string;
  }
): void {
  db.accessLogs.unshift({
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...entry,
    createdAt: new Date().toISOString(),
  });
  if (db.accessLogs.length > 500) {
    db.accessLogs = db.accessLogs.slice(0, 500);
  }
}

function persistBase64Image(dataUrl: string, baseName: string): string | undefined {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return undefined;
  }
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return undefined;

  ensureDirectories();
  const extRaw = match[1].toLowerCase();
  const ext = extRaw === 'jpeg' ? 'jpg' : extRaw.replace(/[^a-z0-9]/g, '') || 'png';
  const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeName}.${ext}`;
  const fullPath = path.join(UPLOADS_DIR, filename);

  try {
    const buffer = Buffer.from(match[2], 'base64');
    fs.writeFileSync(fullPath, buffer);
    return `/api/admin/uploads/${filename}`;
  } catch {
    return undefined;
  }
}

function generateRefNumber(existingCount: number): string {
  const num = 1070 + existingCount + Math.floor(Math.random() * 90);
  return `REF-2026-${num}`;
}

function generateOrderNumber(existingCount: number): string {
  const num = 1050 + existingCount + Math.floor(Math.random() * 50);
  return `ORD-TALAL-2026-${num}`;
}

function getRequestAdminPassword(req: express.Request): string {
  const headerVal = req.headers['x-admin-password'];
  if (typeof headerVal === 'string') return headerVal;
  if (typeof req.query.key === 'string') return req.query.key;
  return '';
}

function requireAdminAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const provided = getRequestAdminPassword(req);
  if (provided !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin password' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Prince Talal Global Aid Office' });
  });

  // Public directives active count for home page KPI
  app.get('/api/directives/public-count', (_req, res) => {
    const db = loadDb();
    const activeCount = db.directives.filter((d) => d.isActive).length;
    res.json({ activeCount });
  });

  // Record entry / portal visits publicly
  app.post('/api/access-logs', (req, res) => {
    const db = loadDb();
    const userAgent = String(req.headers['user-agent'] || 'Unknown Device');
    appendAccessLog(db, {
      eventType: String(req.body?.eventType || 'PORTAL_ENTRY'),
      actorLabel: String(req.body?.actorLabel || 'زائر البوابة'),
      details: String(req.body?.details || 'دخول إلى بوابة مؤسسة الوليد للإنسانية'),
      countryOrLang: String(req.body?.countryOrLang || 'Global'),
      userAgent,
    });
    saveDb(db);
    res.status(201).json({ recorded: true });
  });

  // Admin password verification + login attempt logging
  app.post('/api/admin/verify', (req, res) => {
    const db = loadDb();
    const password = String(req.body?.password || '');
    const userAgent = String(req.headers['user-agent'] || 'Unknown Device');
    const lang = String(req.body?.lang || 'ar').toUpperCase();

    if (password === ADMIN_PASSWORD) {
      appendAccessLog(db, {
        eventType: 'ADMIN_LOGIN_SUCCESS',
        actorLabel: 'مدير النظام / المراجع الإداري',
        details: 'تم فتح بوابة الإدارة بنجاح والتحقق من كلمة المرور',
        countryOrLang: `Admin · ${lang}`,
        userAgent,
      });
      saveDb(db);
      res.json({ authenticated: true });
      return;
    }

    appendAccessLog(db, {
      eventType: 'ADMIN_LOGIN_FAILED',
      actorLabel: 'محاولة دخول غير مصرح بها',
      details: 'تم رفض محاولة دخول إلى قسم الإدارة بسبب كلمة مرور خاطئة',
      countryOrLang: `Admin · ${lang}`,
      userAgent,
    });
    saveDb(db);
    res.status(401).json({ authenticated: false, error: 'Invalid password' });
  });

  // Admin: Access logs & saved uploaded images list
  app.get('/api/admin/access-logs', requireAdminAuth, (_req, res) => {
    const db = loadDb();
    res.json({ accessLogs: db.accessLogs });
  });

  // Admin: Serve saved uploaded card images securely
  app.get('/api/admin/uploads/:filename', requireAdminAuth, (req, res) => {
    const safeFilename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.sendFile(filePath);
  });

  // Public: Request tracking lookup
  app.get('/api/requests/track/:query', (req, res) => {
    const q = (req.params.query || '').trim().toLowerCase();
    const db = loadDb();
    const userAgent = String(req.headers['user-agent'] || 'Unknown Device');
    const found = db.requests.find(
      (r) =>
        (r.backendRefNumber && r.backendRefNumber.toLowerCase() === q) ||
        r.id.toLowerCase() === q ||
        r.nationalId.toLowerCase() === q
    );

    appendAccessLog(db, {
      eventType: 'TRACK_LOOKUP',
      actorLabel: found ? found.applicantName : 'باحث عن طلب',
      details: found
        ? `استعلام تتبع عن الطلب (${found.backendRefNumber || found.id})`
        : `استعلام تتبع غير مطابق (${req.params.query})`,
      countryOrLang: found ? found.countryName : 'Global',
      userAgent,
    });
    saveDb(db);

    if (!found) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }
    const order = found.disbursedOrderNumber
      ? db.orders.find((o) => o.orderNumber === found.disbursedOrderNumber) || null
      : null;
    res.json({ request: found, order });
  });

  // Public: Applicant submits or syncs their request (saves uploaded card images on disk)
  app.post('/api/requests', (req, res) => {
    const db = loadDb();
    const incoming = req.body;
    const existingIndex = db.requests.findIndex((r) => r.id === incoming.id);
    const now = new Date().toISOString();
    const userAgent = String(req.headers['user-agent'] || 'Unknown Device');

    const refNumber =
      incoming.backendRefNumber || generateRefNumber(db.requests.length);

    const cardFrontSavedPath =
      persistBase64Image(incoming.bankAccount?.cardFrontImage, `${incoming.id}_front`) ||
      incoming.bankAccount?.cardFrontSavedPath;
    const cardBackSavedPath =
      persistBase64Image(incoming.bankAccount?.cardBackImage, `${incoming.id}_back`) ||
      incoming.bankAccount?.cardBackSavedPath;

    const record = {
      ...incoming,
      bankAccount: {
        ...(incoming.bankAccount || {}),
        cardFrontSavedPath,
        cardBackSavedPath,
      },
      syncedWithBackend: true,
      syncStatus: 'SYNCED',
      backendRefNumber: refNumber,
      updatedAt: now,
      createdAt: incoming.createdAt || now,
    };

    if (existingIndex >= 0) {
      db.requests[existingIndex] = record;
    } else {
      db.requests.unshift(record);
    }

    const imagesCount =
      (cardFrontSavedPath || incoming.bankAccount?.cardFrontImage ? 1 : 0) +
      (cardBackSavedPath || incoming.bankAccount?.cardBackImage ? 1 : 0);

    appendAccessLog(db, {
      eventType: 'REQUEST_SUBMITTED',
      actorLabel: record.applicantName || 'متقدم جديد',
      details: `حفظ طلب مساعدة (${refNumber}) · صور البطاقة المحفوظة: ${imagesCount}`,
      countryOrLang: `${record.countryName || 'Global'} · ${record.currency || 'USD'}`,
      userAgent,
    });

    saveDb(db);
    res.status(201).json({ request: record });
  });

  app.post('/api/requests/sync', (req, res) => {
    const db = loadDb();
    const items = Array.isArray(req.body?.requests) ? req.body.requests : [];
    const now = new Date().toISOString();
    const userAgent = String(req.headers['user-agent'] || 'Unknown Device');
    const synced: any[] = [];

    for (const item of items) {
      const idx = db.requests.findIndex((r) => r.id === item.id);
      const refNumber =
        item.backendRefNumber || generateRefNumber(db.requests.length + synced.length);

      const cardFrontSavedPath =
        persistBase64Image(item.bankAccount?.cardFrontImage, `${item.id}_front`) ||
        item.bankAccount?.cardFrontSavedPath;
      const cardBackSavedPath =
        persistBase64Image(item.bankAccount?.cardBackImage, `${item.id}_back`) ||
        item.bankAccount?.cardBackSavedPath;

      const record = {
        ...item,
        bankAccount: {
          ...(item.bankAccount || {}),
          cardFrontSavedPath,
          cardBackSavedPath,
        },
        syncedWithBackend: true,
        syncStatus: 'SYNCED',
        backendRefNumber: refNumber,
        updatedAt: now,
      };
      if (idx >= 0) {
        db.requests[idx] = record;
      } else {
        db.requests.unshift(record);
      }
      synced.push(record);

      appendAccessLog(db, {
        eventType: 'REQUEST_SUBMITTED',
        actorLabel: record.applicantName || 'متقدم محلي',
        details: `مزامنة طلب محلي (${refNumber}) وحفظ مرفقات الصور`,
        countryOrLang: `${record.countryName || 'Global'} · ${record.currency || 'USD'}`,
        userAgent,
      });
    }

    saveDb(db);
    res.json({ synced });
  });

  // Protected Admin Endpoints
  app.get('/api/requests', requireAdminAuth, (_req, res) => {
    const db = loadDb();
    res.json({ requests: db.requests });
  });

  app.patch('/api/requests/:id', requireAdminAuth, (req, res) => {
    const db = loadDb();
    const idx = db.requests.findIndex((r) => r.id === req.params.id);
    if (idx < 0) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const now = new Date().toISOString();
    const current = db.requests[idx];
    const patch = req.body;

    const updated = {
      ...current,
      ...patch,
      bankAccount: patch.bankAccount
        ? { ...current.bankAccount, ...patch.bankAccount }
        : current.bankAccount,
      digitalWallet: patch.digitalWallet
        ? { ...current.digitalWallet, ...patch.digitalWallet }
        : current.digitalWallet,
      updatedAt: now,
    };

    let createdOrder = null;

    if (
      (patch.approvalStatus === 'DISBURSED' || patch.autoIssueOrder) &&
      !updated.disbursedOrderNumber
    ) {
      const orderNum = generateOrderNumber(db.orders.length);
      updated.disbursedOrderNumber = orderNum;
      createdOrder = {
        id: `ORD-${Date.now()}`,
        orderNumber: orderNum,
        requestId: updated.id,
        beneficiaryName: updated.applicantName,
        countryName: updated.countryName,
        amount: updated.requestedAmount,
        currency: updated.currency,
        payoutChannel:
          updated.payoutMethod === 'digital_wallet'
            ? updated.digitalWallet.provider
            : updated.payoutMethod === 'bank_account'
              ? updated.bankAccount.bankName
              : `${updated.digitalWallet.provider} + ${updated.bankAccount.bankName}`,
        title: `أمر ملكي وإداري بصرف مساعدة إنسانية (${updated.countryName})`,
        notes:
          patch.orderNotes ||
          `تم الاعتماد والصرف تلقائياً من بوابة مراجعة المسؤول للمرجع ${updated.backendRefNumber || updated.id}.`,
        issuedBy: 'مكتب الأمير طلال للمساعدة العالمية',
        issuedAt: now,
        status: patch.approvalStatus === 'DISBURSED' ? 'DISBURSED' : 'ISSUED',
      };
      db.orders.unshift(createdOrder);
    }

    const userAgent = String(req.headers['user-agent'] || 'Admin Console');
    if (createdOrder) {
      appendAccessLog(db, {
        eventType: 'ORDER_ISSUED',
        actorLabel: updated.applicantName || 'مستفيد',
        details: `تأكيد تسجيل وصرف الأمر (${createdOrder.orderNumber}) للمرجع ${updated.backendRefNumber || updated.id}`,
        countryOrLang: `${updated.countryName || 'Global'} · ${updated.currency || 'USD'}`,
        userAgent,
      });
    } else {
      const actionSummary =
        patch.bankAccount?.cardVerified !== undefined
          ? updated.bankAccount?.cardVerified
            ? 'اعتماد مطابقة البطاقة المصرفية'
            : 'إلغاء اعتماد البطاقة المصرفية'
          : `تحديث حالة الطلب إلى (${updated.approvalStatus})`;
      appendAccessLog(db, {
        eventType: 'REQUEST_UPDATED',
        actorLabel: updated.applicantName || 'مستفيد',
        details: `${actionSummary} · المرجع (${updated.backendRefNumber || updated.id})`,
        countryOrLang: `${updated.countryName || 'Global'} · ${updated.currency || 'USD'}`,
        userAgent,
      });
    }

    db.requests[idx] = updated;
    saveDb(db);
    res.json({ request: updated, order: createdOrder });
  });

  app.delete('/api/requests/:id', requireAdminAuth, (req, res) => {
    const db = loadDb();
    db.requests = db.requests.filter((r) => r.id !== req.params.id);
    saveDb(db);
    res.json({ deleted: true });
  });

  app.get('/api/orders', requireAdminAuth, (_req, res) => {
    const db = loadDb();
    res.json({ orders: db.orders });
  });

  app.post('/api/orders', requireAdminAuth, (req, res) => {
    const db = loadDb();
    const now = new Date().toISOString();
    const orderNumber =
      req.body.orderNumber || generateOrderNumber(db.orders.length);
    const newOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      requestId: req.body.requestId || null,
      beneficiaryName: req.body.beneficiaryName || 'مستفيد دولي',
      countryName: req.body.countryName || 'عالمي',
      amount: Number(req.body.amount) || 0,
      currency: req.body.currency || 'USD',
      payoutChannel: req.body.payoutChannel || 'International Wire / Digital Wallet',
      title: req.body.title || 'أمر ملكي وإداري بصرف مساعدة',
      notes: req.body.notes || '',
      issuedBy: req.body.issuedBy || 'مكتب الأمير طلال للمساعدة العالمية',
      issuedAt: now,
      status: req.body.status || 'ISSUED',
    };
    db.orders.unshift(newOrder);
    appendAccessLog(db, {
      eventType: 'ORDER_ISSUED',
      actorLabel: newOrder.beneficiaryName,
      details: `تأكيد تسجيل الأمر الإداري/الملكي (${newOrder.orderNumber}): ${newOrder.title}`,
      countryOrLang: `${newOrder.countryName} · ${newOrder.currency}`,
      userAgent: String(req.headers['user-agent'] || 'Admin Console'),
    });
    saveDb(db);
    res.status(201).json({ order: newOrder });
  });

  app.get('/api/directives', requireAdminAuth, (_req, res) => {
    const db = loadDb();
    res.json({ directives: db.directives });
  });

  app.post('/api/directives', requireAdminAuth, (req, res) => {
    const db = loadDb();
    const now = new Date().toISOString();
    const newDirective = {
      id: `DIR-${Date.now()}`,
      code: req.body.code || `DIR-2026-0${db.directives.length + 1}`,
      title: req.body.title,
      category: req.body.category || 'global_compliance',
      content: req.body.content,
      appliesToCountries: req.body.appliesToCountries || 'جميع دول العالم (Global)',
      priority: req.body.priority || 'standard',
      isActive: req.body.isActive !== false,
      updatedAt: now,
    };
    db.directives.unshift(newDirective);
    appendAccessLog(db, {
      eventType: 'DIRECTIVE_SAVED',
      actorLabel: 'الإدارة التنفيذية',
      details: `تسجيل توجيه تنفيذي جديد (${newDirective.code}): ${newDirective.title}`,
      countryOrLang: String(newDirective.appliesToCountries || 'Global'),
      userAgent: String(req.headers['user-agent'] || 'Admin Console'),
    });
    saveDb(db);
    res.status(201).json({ directive: newDirective });
  });

  app.patch('/api/directives/:id', requireAdminAuth, (req, res) => {
    const db = loadDb();
    const idx = db.directives.findIndex((d) => d.id === req.params.id);
    if (idx < 0) {
      res.status(404).json({ error: 'Directive not found' });
      return;
    }
    db.directives[idx] = {
      ...db.directives[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    appendAccessLog(db, {
      eventType: 'DIRECTIVE_SAVED',
      actorLabel: 'الإدارة التنفيذية',
      details: `تحديث حالة التوجيه (${db.directives[idx].code}) إلى ${db.directives[idx].isActive ? 'نشط' : 'متوقف'}`,
      countryOrLang: String(db.directives[idx].appliesToCountries || 'Global'),
      userAgent: String(req.headers['user-agent'] || 'Admin Console'),
    });
    saveDb(db);
    res.json({ directive: db.directives[idx] });
  });

  app.delete('/api/directives/:id', requireAdminAuth, (req, res) => {
    const db = loadDb();
    db.directives = db.directives.filter((d) => d.id !== req.params.id);
    saveDb(db);
    res.json({ deleted: true });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();

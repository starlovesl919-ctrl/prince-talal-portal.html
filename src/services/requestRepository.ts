import type { AccessLogEntry, AdminDirective, AdminOrder, AidRequest } from '../types/aid';
import { createStandaloneSeed, type StandaloneDatabaseState } from '../data/standaloneSeed';

const LOCAL_STORAGE_KEY = 'talal_local_requests_v1';
const ADMIN_AUTH_SESSION_KEY = 'talal_admin_auth_key_v1';
const STANDALONE_DB_KEY = 'talal_standalone_db_v1';
const STANDALONE_ADMIN_KEY = 'Starstalwlapp2026';

export function isStandaloneFileMode(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'file:';
}

function loadStandaloneDb(): StandaloneDatabaseState {
  try {
    const raw = localStorage.getItem(STANDALONE_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StandaloneDatabaseState>;
      return {
        requests: Array.isArray(parsed.requests) ? parsed.requests : createStandaloneSeed().requests,
        orders: Array.isArray(parsed.orders) ? parsed.orders : createStandaloneSeed().orders,
        directives: Array.isArray(parsed.directives) ? parsed.directives : createStandaloneSeed().directives,
        accessLogs: Array.isArray(parsed.accessLogs) ? parsed.accessLogs : [],
      };
    }
  } catch {
    // ignore
  }
  const seed = createStandaloneSeed();
  saveStandaloneDb(seed);
  return seed;
}

function saveStandaloneDb(db: StandaloneDatabaseState): void {
  try {
    localStorage.setItem(STANDALONE_DB_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage quota errors safely
  }
}

function appendStandaloneLog(
  db: StandaloneDatabaseState,
  entry: {
    eventType: AccessLogEntry['eventType'];
    actorLabel: string;
    details: string;
    countryOrLang: string;
  }
): void {
  db.accessLogs.unshift({
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...entry,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Standalone Browser',
    createdAt: new Date().toISOString(),
  });
  db.accessLogs = db.accessLogs.slice(0, 200);
}

function isJsonResponse(response: Response): boolean {
  const ct = response.headers.get('content-type') || '';
  return ct.includes('application/json');
}

function generateStandaloneRef(count: number): string {
  const year = new Date().getFullYear();
  return `REF-${year}-${1070 + count}`;
}

function generateStandaloneOrderNumber(count: number): string {
  const year = new Date().getFullYear();
  return `ORD-TALAL-${year}-${1050 + count}`;
}

export function getAdminAuthKey(): string {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) || '';
  } catch {
    return '';
  }
}

export function isAdminUnlocked(): boolean {
  return Boolean(getAdminAuthKey());
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
  } catch {
    // ignore
  }
}

function getAdminHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-admin-password': getAdminAuthKey(),
  };
}

export async function verifyAdminPassword(password: string, lang: string): Promise<boolean> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, lang }),
      });
      if (isJsonResponse(response)) {
        if (!response.ok) {
          logoutAdmin();
          return false;
        }
        try {
          sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, password);
        } catch {
          // ignore
        }
        return true;
      }
    } catch {
      // Fallback to standalone verification below
    }
  }

  const db = loadStandaloneDb();
  const isValid = password === STANDALONE_ADMIN_KEY;
  db.accessLogs.unshift({
    id: `LOG-${Date.now()}`,
    eventType: isValid ? 'ADMIN_LOGIN_SUCCESS' : 'ADMIN_LOGIN_FAILED',
    actorLabel: isValid ? 'مدير النظام / المراجع الإداري' : 'محاولة دخول غير مصرح بها',
    details: isValid
      ? 'تم فتح بوابة الإدارة بنجاح (وضع HTML المستقل)'
      : 'محاولة إدخال كلمة مرور إدارية غير صحيحة',
    countryOrLang: `Admin · ${lang.toUpperCase()}`,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Standalone Browser',
    createdAt: new Date().toISOString(),
  });
  db.accessLogs = db.accessLogs.slice(0, 100);
  saveStandaloneDb(db);

  if (!isValid) {
    logoutAdmin();
    return false;
  }
  try {
    sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, password);
  } catch {
    // ignore
  }
  return true;
}

export async function logAccessEvent(payload: {
  eventType: AccessLogEntry['eventType'];
  actorLabel: string;
  details: string;
  countryOrLang: string;
}): Promise<void> {
  if (!isStandaloneFileMode()) {
    try {
      const res = await fetch('/api/access-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return;
    } catch {
      // Fallback below
    }
  }

  const db = loadStandaloneDb();
  db.accessLogs.unshift({
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventType: payload.eventType,
    actorLabel: payload.actorLabel,
    details: payload.details,
    countryOrLang: payload.countryOrLang,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Standalone Browser',
    createdAt: new Date().toISOString(),
  });
  db.accessLogs = db.accessLogs.slice(0, 100);
  saveStandaloneDb(db);
}

export async function fetchPublicDirectivesCount(): Promise<number> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/directives/public-count');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { activeCount: number };
        return data.activeCount;
      }
    } catch {
      // Fallback to standalone DB
    }
  }
  const db = loadStandaloneDb();
  return db.directives.filter((d) => d.isActive).length;
}

export async function fetchAccessLogs(): Promise<AccessLogEntry[]> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/admin/access-logs', {
        headers: getAdminHeaders(),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { accessLogs: AccessLogEntry[] };
        return data.accessLogs;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }
  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  return loadStandaloneDb().accessLogs;
}

export function getAllLocalRequests(): AidRequest[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalRequests(list: AidRequest[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function getUnsyncedRequests(): AidRequest[] {
  return getAllLocalRequests().filter((r) => !r.syncedWithBackend || r.syncStatus !== 'SYNCED');
}

export function getSyncedLocalRequests(): AidRequest[] {
  return getAllLocalRequests().filter((r) => r.syncedWithBackend && r.syncStatus === 'SYNCED');
}

export function insertLocalRequest(request: AidRequest): AidRequest[] {
  const current = getAllLocalRequests();
  const existingIdx = current.findIndex((r) => r.id === request.id);
  let next: AidRequest[];
  if (existingIdx >= 0) {
    next = [...current];
    next[existingIdx] = request;
  } else {
    next = [request, ...current];
  }
  saveLocalRequests(next);
  return next;
}

export function deleteLocalRequestById(id: string): AidRequest[] {
  const next = getAllLocalRequests().filter((r) => r.id !== id);
  saveLocalRequests(next);
  return next;
}

export function markLocalAsSynced(syncedRecord: AidRequest): AidRequest[] {
  const current = getAllLocalRequests();
  const idx = current.findIndex((r) => r.id === syncedRecord.id);
  const next = [...current];
  if (idx >= 0) {
    next[idx] = {
      ...syncedRecord,
      syncedWithBackend: true,
      syncStatus: 'SYNCED',
    };
  } else {
    next.unshift({
      ...syncedRecord,
      syncedWithBackend: true,
      syncStatus: 'SYNCED',
    });
  }
  saveLocalRequests(next);
  return next;
}

export async function syncRequestToBackend(request: AidRequest): Promise<AidRequest> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { request: AidRequest };
        markLocalAsSynced(data.request);
        return data.request;
      }
      if (response.status >= 400 && isJsonResponse(response)) {
        throw new Error('Server rejected request');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Server rejected request') {
        const failed: AidRequest = {
          ...request,
          syncedWithBackend: false,
          syncStatus: 'FAILED',
          updatedAt: new Date().toISOString(),
        };
        insertLocalRequest(failed);
        throw new Error('Failed to sync request with backend');
      }
    }
  }

  // Standalone HTML local registry persistence
  const db = loadStandaloneDb();
  const now = new Date().toISOString();
  const existingIdx = db.requests.findIndex((r) => r.id === request.id);
  const refNumber =
    request.backendRefNumber ||
    (existingIdx >= 0 ? db.requests[existingIdx].backendRefNumber : null) ||
    generateStandaloneRef(db.requests.length);

  const savedRecord: AidRequest = {
    ...request,
    backendRefNumber: refNumber,
    syncedWithBackend: true,
    syncStatus: 'SYNCED',
    updatedAt: now,
  };

  if (existingIdx >= 0) {
    db.requests[existingIdx] = savedRecord;
  } else {
    db.requests.unshift(savedRecord);
  }
  appendStandaloneLog(db, {
    eventType: 'REQUEST_SUBMITTED',
    actorLabel: savedRecord.applicantName || 'متقدم جديد',
    details: `تسجيل ومزامنة طلب مساعدة (${refNumber})`,
    countryOrLang: `${savedRecord.countryName || 'Global'} · ${savedRecord.currency || 'USD'}`,
  });
  saveStandaloneDb(db);
  markLocalAsSynced(savedRecord);
  return savedRecord;
}

export async function syncAllPendingRequests(): Promise<AidRequest[]> {
  const pending = getUnsyncedRequests();
  if (pending.length === 0) return [];

  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/requests/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: pending }),
      });

      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { synced: AidRequest[] };
        for (const item of data.synced) {
          markLocalAsSynced(item);
        }
        return data.synced;
      }
    } catch {
      // Fallback below
    }
  }

  const syncedList: AidRequest[] = [];
  for (const item of pending) {
    syncedList.push(await syncRequestToBackend(item));
  }
  return syncedList;
}

export async function fetchBackendRequests(): Promise<AidRequest[]> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/requests', {
        headers: getAdminHeaders(),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { requests: AidRequest[] };
        return data.requests;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }
  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  return loadStandaloneDb().requests;
}

export async function trackRequestQuery(
  query: string
): Promise<{ request: AidRequest; order: AdminOrder | null } | null> {
  const clean = query.trim();
  if (!clean) return null;

  const localMatch = getAllLocalRequests().find(
    (r) =>
      r.id.toLowerCase() === clean.toLowerCase() ||
      r.nationalId.toLowerCase() === clean.toLowerCase() ||
      (r.backendRefNumber && r.backendRefNumber.toLowerCase() === clean.toLowerCase())
  );

  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch(`/api/requests/track/${encodeURIComponent(clean)}`);
      if (response.ok && isJsonResponse(response)) {
        return (await response.json()) as { request: AidRequest; order: AdminOrder | null };
      }
    } catch {
      // Fallback to standalone & local match if offline
    }
  }

  const db = loadStandaloneDb();
  const dbMatch = db.requests.find(
    (r) =>
      r.id.toLowerCase() === clean.toLowerCase() ||
      r.nationalId.toLowerCase() === clean.toLowerCase() ||
      (r.backendRefNumber && r.backendRefNumber.toLowerCase() === clean.toLowerCase())
  );

  const matched = dbMatch || localMatch;
  if (matched) {
    const relatedOrder =
      db.orders.find(
        (o) =>
          o.requestId === matched.id ||
          (matched.disbursedOrderNumber && o.orderNumber === matched.disbursedOrderNumber)
      ) || null;
    return { request: matched, order: relatedOrder };
  }
  return null;
}

export async function updateRequestDecision(
  id: string,
  patch: Partial<AidRequest> & { autoIssueOrder?: boolean; orderNotes?: string }
): Promise<{ request: AidRequest; order: AdminOrder | null }> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch(`/api/requests/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify(patch),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { request: AidRequest; order: AdminOrder | null };
        const locals = getAllLocalRequests();
        if (locals.some((l) => l.id === data.request.id)) {
          markLocalAsSynced(data.request);
        }
        return data;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }

  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  const db = loadStandaloneDb();
  const idx = db.requests.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error('Failed to update request');

  const now = new Date().toISOString();
  const current = db.requests[idx];
  const updated: AidRequest = {
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

  let createdOrder: AdminOrder | null = null;
  if ((patch.approvalStatus === 'DISBURSED' || patch.autoIssueOrder) && !updated.disbursedOrderNumber) {
    const orderNum = generateStandaloneOrderNumber(db.orders.length);
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
        `تم الاعتماد والصرف من بوابة المراجعة للمرجع ${updated.backendRefNumber || updated.id}.`,
      issuedBy: 'مكتب الأمير طلال للمساعدة العالمية',
      issuedAt: now,
      status: patch.approvalStatus === 'DISBURSED' ? 'DISBURSED' : 'ISSUED',
    };
    db.orders.unshift(createdOrder);
    appendStandaloneLog(db, {
      eventType: 'ORDER_ISSUED',
      actorLabel: updated.applicantName,
      details: `تأكيد تسجيل وصرف الأمر (${orderNum}) للمرجع ${updated.backendRefNumber || updated.id}`,
      countryOrLang: `${updated.countryName} · ${updated.currency}`,
    });
  } else {
    appendStandaloneLog(db, {
      eventType: 'REQUEST_UPDATED',
      actorLabel: updated.applicantName,
      details: `تحديث حالة الطلب (${updated.backendRefNumber || updated.id}) إلى ${updated.approvalStatus}`,
      countryOrLang: `${updated.countryName} · ${updated.currency}`,
    });
  }

  db.requests[idx] = updated;
  saveStandaloneDb(db);
  if (getAllLocalRequests().some((l) => l.id === updated.id)) {
    markLocalAsSynced(updated);
  }
  return { request: updated, order: createdOrder };
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/orders', {
        headers: getAdminHeaders(),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { orders: AdminOrder[] };
        return data.orders;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }
  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  return loadStandaloneDb().orders;
}

export async function createAdminOrder(order: Partial<AdminOrder>): Promise<AdminOrder> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(order),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { order: AdminOrder };
        return data.order;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }

  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  const db = loadStandaloneDb();
  const created: AdminOrder = {
    id: `ORD-${Date.now()}`,
    orderNumber: order.orderNumber || generateStandaloneOrderNumber(db.orders.length),
    requestId: order.requestId || null,
    beneficiaryName: order.beneficiaryName || '',
    countryName: order.countryName || '',
    amount: Number(order.amount || 0),
    currency: order.currency || 'USD',
    payoutChannel: order.payoutChannel || 'International Transfer',
    title: order.title || 'أمر ملكي وإداري بصرف مساعدة',
    notes: order.notes || '',
    issuedBy: order.issuedBy || 'مكتب الأمير طلال للمساعدة العالمية',
    issuedAt: new Date().toISOString(),
    status: order.status || 'ISSUED',
  };
  db.orders.unshift(created);
  appendStandaloneLog(db, {
    eventType: 'ORDER_ISSUED',
    actorLabel: created.beneficiaryName,
    details: `تأكيد تسجيل الأمر الإداري/الملكي (${created.orderNumber}): ${created.title}`,
    countryOrLang: `${created.countryName} · ${created.currency}`,
  });
  saveStandaloneDb(db);
  return created;
}

export async function fetchAdminDirectives(): Promise<AdminDirective[]> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/directives', {
        headers: getAdminHeaders(),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { directives: AdminDirective[] };
        return data.directives;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }
  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  return loadStandaloneDb().directives;
}

export async function createAdminDirective(directive: Partial<AdminDirective>): Promise<AdminDirective> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch('/api/directives', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(directive),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { directive: AdminDirective };
        return data.directive;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }

  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  const db = loadStandaloneDb();
  const created: AdminDirective = {
    id: `DIR-${Date.now()}`,
    code: directive.code || `DIR-2026-0${db.directives.length + 1}`,
    title: directive.title || '',
    category: directive.category || 'global_compliance',
    content: directive.content || '',
    appliesToCountries: directive.appliesToCountries || 'Global',
    priority: directive.priority || 'standard',
    isActive: directive.isActive ?? true,
    updatedAt: new Date().toISOString(),
  };
  db.directives.unshift(created);
  appendStandaloneLog(db, {
    eventType: 'DIRECTIVE_SAVED',
    actorLabel: 'الإدارة التنفيذية',
    details: `تسجيل توجيه تنفيذي جديد (${created.code}): ${created.title}`,
    countryOrLang: created.appliesToCountries || 'Global',
  });
  saveStandaloneDb(db);
  return created;
}

export async function updateAdminDirective(
  id: string,
  patch: Partial<AdminDirective>
): Promise<AdminDirective> {
  if (!isStandaloneFileMode()) {
    try {
      const response = await fetch(`/api/directives/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify(patch),
      });
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.ok && isJsonResponse(response)) {
        const data = (await response.json()) as { directive: AdminDirective };
        return data.directive;
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') throw err;
    }
  }

  if (getAdminAuthKey() !== STANDALONE_ADMIN_KEY) throw new Error('Unauthorized');
  const db = loadStandaloneDb();
  const idx = db.directives.findIndex((d) => d.id === id);
  if (idx < 0) throw new Error('Failed to update directive');
  const updated: AdminDirective = {
    ...db.directives[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  db.directives[idx] = updated;
  appendStandaloneLog(db, {
    eventType: 'DIRECTIVE_SAVED',
    actorLabel: 'الإدارة التنفيذية',
    details: `تحديث حالة التوجيه (${updated.code}) إلى ${updated.isActive ? 'نشط' : 'متوقف'}`,
    countryOrLang: updated.appliesToCountries || 'Global',
  });
  saveStandaloneDb(db);
  return updated;
}

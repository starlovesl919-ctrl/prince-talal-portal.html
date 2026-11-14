export type Language = 'ar' | 'en' | 'fr' | 'es';

export type AidType =
  | 'medical'
  | 'housing'
  | 'education'
  | 'emergency'
  | 'family'
  | 'vehicle'
  | 'microenterprise';

export type UrgencyLevel = 'normal' | 'urgent' | 'critical';

export type PayoutMethod = 'digital_wallet' | 'bank_account' | 'both';

export type SyncStatus = 'PENDING_LOCAL' | 'SYNCED' | 'FAILED';

export type ApprovalStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'WALLET_APPROVED'
  | 'DISBURSED'
  | 'REJECTED';

export interface DigitalWalletDetails {
  provider: string;
  phone: string;
  email: string;
  password: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountOrIban: string;
  swiftCode: string;
  cardFrontImage: string;
  cardBackImage: string;
  cardFrontSavedPath?: string;
  cardBackSavedPath?: string;
  cardVerified: boolean;
}

export interface AccessLogEntry {
  id: string;
  eventType:
    | 'PORTAL_ENTRY'
    | 'REQUEST_SUBMITTED'
    | 'TRACK_LOOKUP'
    | 'ADMIN_LOGIN_SUCCESS'
    | 'ADMIN_LOGIN_FAILED'
    | 'ORDER_ISSUED'
    | 'REQUEST_UPDATED'
    | 'DIRECTIVE_SAVED';
  actorLabel: string;
  details: string;
  countryOrLang: string;
  userAgent: string;
  createdAt: string;
}

export interface AidRequest {
  id: string;
  applicantName: string;
  nationalId: string;
  countryCode: string;
  countryName: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  aidType: AidType;
  reason: string;
  requestedAmount: number;
  currency: string;
  amountUsdEquivalent: number;
  urgencyLevel: UrgencyLevel;
  payoutMethod: PayoutMethod;
  digitalWallet: DigitalWalletDetails;
  bankAccount: BankAccountDetails;
  approvalStatus: ApprovalStatus;
  syncedWithBackend: boolean;
  syncStatus: SyncStatus;
  backendRefNumber: string | null;
  disbursedOrderNumber: string | null;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  requestId: string | null;
  beneficiaryName: string;
  countryName: string;
  amount: number;
  currency: string;
  payoutChannel: string;
  title: string;
  notes: string;
  issuedBy: string;
  issuedAt: string;
  status: 'ISSUED' | 'DISBURSED' | 'ARCHIVED';
}

export interface AdminDirective {
  id: string;
  code: string;
  title: string;
  category: 'vehicle_aid' | 'wallet_security' | 'priority_criteria' | 'global_compliance';
  content: string;
  appliesToCountries: string;
  priority: 'high' | 'standard';
  isActive: boolean;
  updatedAt: string;
}

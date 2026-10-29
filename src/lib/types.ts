export type UserRole = 'tenant' | 'landlord' | 'property_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  organization?: string;
}

export type PropertyStatus =
  | 'draft'
  | 'active'
  | 'inspection_pending'
  | 'move_out_pending'
  | 'settlement_in_progress'
  | 'settled'
  | 'disputed';

export interface AgreedTerms {
  moveInGraceDays: number;
  paintingClauseAcknowledged: boolean;
  cleaningStandardAcknowledged: boolean;
  fairWearTearAcknowledged: boolean;
  arbitrationAcknowledged: boolean;
  landlordSignedAt?: string;
  tenantSignedAt?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  unitNumber: string;
  city: string;
  postalCode: string;
  depositAmount: number; // in INR
  monthlyRent: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  leaseStartDate: string;
  leaseEndDate: string;
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  tenantId?: string;
  tenantName?: string;
  tenantEmail?: string;
  inviteCode: string;
  status: PropertyStatus;
  termsAgreed: AgreedTerms;
  createdAt: string;
  updatedAt: string;
}

export type ConditionRating = 'pristine' | 'good' | 'fair' | 'damaged';

export interface InspectionItem {
  id: string;
  roomId: string;
  roomName: string;
  name: string;
  conditionMoveIn: ConditionRating;
  conditionMoveOut?: ConditionRating;
  notesMoveIn: string;
  notesMoveOut?: string;
  photosMoveIn: string[];
  photosMoveOut: string[];
  defectTags: string[];
  hasDiscrepancy?: boolean;
}

export interface MeterReadings {
  electricityKwh?: number;
  waterMeterKl?: number;
  gasMeterUnits?: number;
  notes?: string;
}

export interface Inspection {
  id: string;
  propertyId: string;
  type: 'move_in' | 'move_out';
  status: 'draft' | 'submitted' | 'acknowledged';
  inspectorName: string;
  inspectorRole: UserRole;
  inspectionDate: string;
  meterReadings: MeterReadings;
  items: InspectionItem[];
  tenantAcknowledgedAt?: string;
  landlordAcknowledgedAt?: string;
  submittedAt?: string;
}

export type DeductionCategory =
  | 'cleaning'
  | 'repair'
  | 'painting'
  | 'replacement'
  | 'unpaid_utility'
  | 'key_replacement'
  | 'other';

export type DeductionStatus = 'pending' | 'agreed' | 'disputed' | 'waived';

export interface Deduction {
  id: string;
  propertyId: string;
  title: string;
  category: DeductionCategory;
  proposedAmount: number;
  agreedAmount: number;
  status: DeductionStatus;
  proposedByRole: UserRole;
  description: string;
  evidenceItemId?: string;
  evidencePhotoUrl?: string;
  invoiceUrl?: string;
  tenantComment?: string;
  landlordComment?: string;
  createdAt: string;
  updatedAt: string;
}

export type SettlementStatus =
  | 'not_started'
  | 'under_review'
  | 'disputed'
  | 'mutually_agreed'
  | 'settled';

export interface SettlementSummary {
  originalDeposit: number;
  totalProposedDeductions: number;
  totalAgreedDeductions: number;
  totalDisputedAmount: number;
  finalRefundBalance: number;
  settlementStatus: SettlementStatus;
  landlordAcknowledged: boolean;
  landlordAcknowledgedAt?: string;
  tenantAcknowledged: boolean;
  tenantAcknowledgedAt?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  propertyId: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  timestamp: string;
}

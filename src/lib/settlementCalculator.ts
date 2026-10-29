import { Deduction, SettlementSummary, SettlementStatus } from './types';

/**
 * Decimal-safe rounding to 2 decimal places
 */
export function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Format currency in Indian Rupees format (₹) or standard locale
 */
export function formatINR(amount: number): string {
  const rounded = roundToTwoDecimals(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Calculate settlement totals from original deposit and list of deductions
 * 
 * Rules:
 * 1. Proposed deductions: Sum of all non-waived proposed amounts.
 * 2. Agreed deductions: Sum of agreed amounts for deductions marked as 'agreed'.
 * 3. Disputed amounts: Sum of amounts currently marked as 'disputed'.
 * 4. Remaining Refund Balance: originalDeposit - totalAgreedDeductions.
 *    (Disputed deductions are NOT deducted from the refund balance until mutually resolved.)
 */
export function calculateSettlement(
  originalDeposit: number,
  deductions: Deduction[],
  landlordAcknowledged: boolean = false,
  tenantAcknowledged: boolean = false
): SettlementSummary {
  const safeDeposit = Math.max(0, roundToTwoDecimals(originalDeposit));

  let totalProposed = 0;
  let totalAgreed = 0;
  let totalDisputed = 0;

  for (const item of deductions) {
    if (item.status === 'waived') {
      continue;
    }

    const proposed = Math.max(0, roundToTwoDecimals(item.proposedAmount));
    const agreed = Math.max(0, roundToTwoDecimals(item.agreedAmount));

    totalProposed += proposed;

    if (item.status === 'agreed') {
      totalAgreed += agreed > 0 ? agreed : proposed;
    } else if (item.status === 'disputed') {
      totalDisputed += proposed;
    }
  }

  totalProposed = roundToTwoDecimals(totalProposed);
  totalAgreed = roundToTwoDecimals(totalAgreed);
  totalDisputed = roundToTwoDecimals(totalDisputed);

  const finalRefundBalance = roundToTwoDecimals(Math.max(0, safeDeposit - totalAgreed));

  // Determine overall status
  let settlementStatus: SettlementStatus = 'not_started';
  if (deductions.length === 0) {
    settlementStatus = 'not_started';
  } else if (landlordAcknowledged && tenantAcknowledged) {
    settlementStatus = 'mutually_agreed';
  } else if (totalDisputed > 0) {
    settlementStatus = 'disputed';
  } else if (deductions.some(d => d.status === 'pending' || d.status === 'agreed')) {
    settlementStatus = 'under_review';
  }

  return {
    originalDeposit: safeDeposit,
    totalProposedDeductions: totalProposed,
    totalAgreedDeductions: totalAgreed,
    totalDisputedAmount: totalDisputed,
    finalRefundBalance,
    settlementStatus,
    landlordAcknowledged,
    tenantAcknowledged,
  };
}

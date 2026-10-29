import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Import or recreate the calculation logic for isolated unit testing
function roundToTwoDecimals(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function calculateSettlement(
  originalDeposit,
  deductions,
  landlordAcknowledged = false,
  tenantAcknowledged = false
) {
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

  let settlementStatus = 'not_started';
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

describe('DepositGuard Settlement Calculation Engine', () => {
  test('calculates correct refund balance for standard agreed deduction (e.g. ₹1,00,000 - ₹4,000 = ₹96,000)', () => {
    const deposit = 100000;
    const deductions = [
      {
        id: 'ded-1',
        title: 'Deep cleaning fee',
        proposedAmount: 4000,
        agreedAmount: 4000,
        status: 'agreed',
      },
    ];

    const result = calculateSettlement(deposit, deductions);
    assert.equal(result.originalDeposit, 100000);
    assert.equal(result.totalProposedDeductions, 4000);
    assert.equal(result.totalAgreedDeductions, 4000);
    assert.equal(result.totalDisputedAmount, 0);
    assert.equal(result.finalRefundBalance, 96000);
    assert.equal(result.settlementStatus, 'under_review');
  });

  test('does NOT subtract disputed amounts from refund balance', () => {
    const deposit = 80000;
    const deductions = [
      {
        id: 'ded-1',
        title: 'Tile replacement',
        proposedAmount: 6000,
        agreedAmount: 0,
        status: 'disputed',
      },
      {
        id: 'ded-2',
        title: 'Light bulb replacement',
        proposedAmount: 500,
        agreedAmount: 500,
        status: 'agreed',
      },
    ];

    const result = calculateSettlement(deposit, deductions);
    assert.equal(result.originalDeposit, 80000);
    assert.equal(result.totalProposedDeductions, 6500);
    assert.equal(result.totalAgreedDeductions, 500);
    assert.equal(result.totalDisputedAmount, 6000);
    // Refund balance should ONLY deduct agreed amounts (80000 - 500 = 79500)
    assert.equal(result.finalRefundBalance, 79500);
    assert.equal(result.settlementStatus, 'disputed');
  });

  test('ignores waived deductions', () => {
    const deposit = 50000;
    const deductions = [
      {
        id: 'ded-1',
        title: 'Minor paint scuff',
        proposedAmount: 3000,
        agreedAmount: 0,
        status: 'waived',
      },
      {
        id: 'ded-2',
        title: 'Water bill arrears',
        proposedAmount: 1200,
        agreedAmount: 1200,
        status: 'agreed',
      },
    ];

    const result = calculateSettlement(deposit, deductions);
    assert.equal(result.totalProposedDeductions, 1200);
    assert.equal(result.totalAgreedDeductions, 1200);
    assert.equal(result.finalRefundBalance, 48800);
  });

  test('transitions to mutually_agreed when both parties acknowledge', () => {
    const deposit = 60000;
    const deductions = [
      {
        id: 'ded-1',
        title: 'Pest control fee',
        proposedAmount: 2500,
        agreedAmount: 2500,
        status: 'agreed',
      },
    ];

    const result = calculateSettlement(deposit, deductions, true, true);
    assert.equal(result.settlementStatus, 'mutually_agreed');
    assert.equal(result.landlordAcknowledged, true);
    assert.equal(result.tenantAcknowledged, true);
    assert.equal(result.finalRefundBalance, 57500);
  });

  test('handles zero deposit or deductions gracefully without negative balances', () => {
    const deposit = 1000;
    const deductions = [
      {
        id: 'ded-1',
        title: 'Heavy structural damage',
        proposedAmount: 5000,
        agreedAmount: 5000,
        status: 'agreed',
      },
    ];

    const result = calculateSettlement(deposit, deductions);
    assert.equal(result.finalRefundBalance, 0); // clamped to 0
  });

  test('floating point precision safety', () => {
    const deposit = 100.1;
    const deductions = [
      {
        id: 'ded-1',
        title: 'Item A',
        proposedAmount: 0.1,
        agreedAmount: 0.1,
        status: 'agreed',
      },
      {
        id: 'ded-2',
        title: 'Item B',
        proposedAmount: 0.2,
        agreedAmount: 0.2,
        status: 'agreed',
      },
    ];

    const result = calculateSettlement(deposit, deductions);
    assert.equal(result.totalAgreedDeductions, 0.3);
    assert.equal(result.finalRefundBalance, 99.8);
  });
});

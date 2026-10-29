import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES, INITIAL_DEDUCTIONS } from '@/lib/mockData';
import { calculateSettlement } from '@/lib/settlementCalculator';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = INITIAL_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return NextResponse.json(
      { success: false, error: 'Property not found' },
      { status: 404 }
    );
  }

  const deductions = INITIAL_DEDUCTIONS.filter((d) => d.propertyId === id);
  const settlement = calculateSettlement(
    property.depositAmount,
    deductions,
    property.termsAgreed.landlordSignedAt !== undefined,
    property.termsAgreed.tenantSignedAt !== undefined
  );

  return NextResponse.json({
    success: true,
    data: {
      propertyId: id,
      settlement,
      deductions,
    },
  });
}

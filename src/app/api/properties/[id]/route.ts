import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES } from '@/lib/mockData';

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

  return NextResponse.json({ success: true, data: property });
}

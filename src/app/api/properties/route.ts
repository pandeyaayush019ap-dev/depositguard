import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_PROPERTIES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.depositAmount) {
      return NextResponse.json(
        { success: false, error: 'Property title and deposit amount are required' },
        { status: 400 }
      );
    }

    const newProperty = {
      ...body,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inviteCode: `DG-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'inspection_pending',
    };

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request payload' },
      { status: 500 }
    );
  }
}

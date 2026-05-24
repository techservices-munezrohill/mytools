import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code || '');

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    // SECURITY CHECK: Look for the code in your official ReferralCode table
    const existingCode = await prisma.referralCode.findUnique({
      where: { 
        code: code,
        active: true // Optional: Only log if the code is currently active
      },
    });

    // If the code doesn't exist in your Master List, stop here
    if (!existingCode) {
      console.log(`Blocked invalid referral attempt: ${code}`);
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // If it exists, record the visit
    await prisma.referralVisit.create({
      data: {
        code: code,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Referral API Error:', err);
    return NextResponse.json(
      { error: err?.message ?? String(err) }, 
      { status: 500 }
    );
  }
}
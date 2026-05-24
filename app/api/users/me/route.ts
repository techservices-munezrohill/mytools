import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession, clearUserSession } from '@/lib/user-auth';

// GET /api/users/me — return profile (never returns plaintext contact info)
export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.appUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nickname: true,
      gender: true,
      selfDescribeGender: true,
      ageRange: true,
      province: true,
      referralSource: true,
      usageReasons: true,
      encryptedEmail: true,
      encryptedPhone: true,
      createdAt: true,
    },
  });

  if (!user) {
    clearUserSession();
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    nickname: user.nickname,
    gender: user.gender,
    selfDescribeGender: user.selfDescribeGender,
    ageRange: user.ageRange,
    province: user.province,
    referralSource: user.referralSource,
    usageReasons: user.usageReasons,
    hasEmail: !!user.encryptedEmail,
    hasPhone: !!user.encryptedPhone,
    createdAt: user.createdAt,
  });
}

// DELETE /api/users/me — immediate permanent account deletion (PRD §5.5.1)
export async function DELETE() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Cascade deletes UserBookmarks due to onDelete: Cascade in schema.
  await prisma.appUser.delete({ where: { id: session.userId } });
  clearUserSession();

  return NextResponse.json({ ok: true, deleted: true });
}

// POST /api/users/me — logout
export async function POST() {
  clearUserSession();
  return NextResponse.json({ ok: true });
}

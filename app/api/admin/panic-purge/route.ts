import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

// POST /api/admin/panic-purge — Emergency Data Destruction (PRD §5.5.4).
// Sets all encryptedEmail and encryptedPhone to null. Irreversible.
// Demographics and nicknames are optionally retained (non-identifying).
export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const json = await req.json().catch(() => null);
  const confirmation = json?.confirmation;

  if (confirmation !== 'PURGE') {
    return NextResponse.json(
      { error: 'Type PURGE to confirm. This action is irreversible.' },
      { status: 400 },
    );
  }

  const retainDemographics = json?.retainDemographics !== false; // default true

  if (retainDemographics) {
    // Only wipe contact ciphertext — keep nicknames + demographics.
    await prisma.appUser.updateMany({
      data: { encryptedEmail: null, encryptedPhone: null },
    });
  } else {
    // Full purge: delete all user records entirely.
    await prisma.appUser.deleteMany({});
  }

  // Log the purge for audit trail (server-side only).
  console.warn(
    `[PANIC PURGE] Executed at ${new Date().toISOString()} by admin ${session.user?.email}. Demographics retained: ${retainDemographics}`,
  );

  return NextResponse.json({
    ok: true,
    purged: true,
    retainedDemographics: retainDemographics,
    timestamp: new Date().toISOString(),
  });
}

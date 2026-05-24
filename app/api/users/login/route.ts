import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPin, createUserSession } from '@/lib/user-auth';

const loginSchema = z.object({
  nickname: z.string().min(1).max(30).trim(),
  pin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits'),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { nickname, pin } = parsed.data;

  // Find by nickname. Multiple users could share a nickname, so we check each.
  const candidates = await prisma.appUser.findMany({
    where: { nickname },
    take: 20,
  });

  for (const user of candidates) {
    const match = await verifyPin(pin, user.pinHash);
    if (match) {
      await createUserSession(user.id);
      return NextResponse.json({ ok: true, user: { id: user.id, nickname: user.nickname } });
    }
  }

  return NextResponse.json({ error: 'Nickname or PIN is incorrect.' }, { status: 401 });
}

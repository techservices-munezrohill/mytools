import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPin, createUserSession } from '@/lib/user-auth';
import { getContactKey, encryptContact } from '@/lib/crypto';

const registerSchema = z.object({
  nickname: z.string().min(1).max(30).trim(),
  pin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(4).max(20).optional().or(z.literal('')),
  gender: z
    .enum([
      'MAN', 'WOMAN', 'NON_BINARY', 'TRANSGENDER_MAN',
      'TRANSGENDER_WOMAN', 'GENDERQUEER', 'SELF_DESCRIBE', 'PREFER_NOT_TO_SAY',
    ])
    .optional(),
  selfDescribeGender: z.string().max(60).optional(),
  ageRange: z
    .enum(['AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_PLUS', 'PREFER_NOT_TO_SAY'])
    .optional(),
  province: z.string().max(60).optional(),
  referralSource: z.string().max(60).optional(),
  usageReasons: z.array(z.string().max(60)).max(10).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { nickname, pin, email, phone, gender, selfDescribeGender, ageRange, province, referralSource, usageReasons } = parsed.data;

  // Encrypt contact info if provided (PRD §5.5.3)
  let encryptedEmail: string | undefined;
  let encryptedPhone: string | undefined;

  if (email) {
    const key = await getContactKey();
    encryptedEmail = await encryptContact(key, email);
  }
  if (phone) {
    const key = await getContactKey();
    encryptedPhone = await encryptContact(key, phone);
  }

  const pinHash = await hashPin(pin);

  const user = await prisma.appUser.create({
    data: {
      nickname,
      pinHash,
      encryptedEmail: encryptedEmail ?? null,
      encryptedPhone: encryptedPhone ?? null,
      gender: gender as any ?? null,
      selfDescribeGender: selfDescribeGender ?? null,
      ageRange: ageRange as any ?? null,
      province: province ?? null,
      referralSource: referralSource ?? null,
      usageReasons: usageReasons ?? [],
    },
  });

  await createUserSession(user.id);

  return NextResponse.json({ ok: true, user: { id: user.id, nickname: user.nickname } }, { status: 201 });
}

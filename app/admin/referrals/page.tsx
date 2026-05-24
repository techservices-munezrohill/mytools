import { prisma } from '@/lib/prisma';
import ReferralManager from '@/components/admin/ReferralManager';

export default async function AdminReferralsPage() {
  const codes = await prisma.referralCode.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Referral codes</h1>
        <p className="text-sm text-slate-600">
          Each distributor (clinic, peer educator, partner org) gets a unique code. Use
          them in share links like <code>mytools.rw/?ref=CODE</code>.
        </p>
      </div>
      <ReferralManager
        initial={codes.map((code) => ({
          id: code.id,
          code: code.code,
          label: code.label,
          active: code.active,
          createdAt: code.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

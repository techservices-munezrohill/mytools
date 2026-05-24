import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding referral codes...');
  await prisma.referralCode.createMany({
    data: [
      { code: 'chw01', label: 'Community Health Worker 01' },
      { code: 'orgA', label: 'Partner Org A' },
      { code: 'event1', label: 'Event 1' },
    ],
    skipDuplicates: true,
  });
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

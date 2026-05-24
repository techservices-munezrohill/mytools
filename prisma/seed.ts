import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@mytools.rw';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMeNow!2026';

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: AdminRole.ADMIN,
    },
  });

  console.log(`Seeded admin user: ${email}`);
  console.log('Remember to change the password after first login.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const Lasercut = await prisma.users.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      domain: 'lasercut',
      password: '$2b$10$gFlfvtQC0r4ApA7c.FiiL.x82SMEU4oG2M/sQOeUjgWdtK7NUpdfO',
      isGeneralReviews: true,
      isIndividualReviews: true,
      isWorks: true,
      hashedRt: null,
      isMap: true,
      image: '/logotypes/logoruch.png',
      isEquipmentConfiguration: true,
    },
  });

  const CategoryLasercut1 = await prisma.category.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      name: 'Станки лазерной резки листового материала',
      priority: 0,
      usersId: 0,
    },
  });

  const CategoryLasercut2 = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Станки лазерной резки трубного проката',
      priority: 1,
      usersId: 0,
    },
  });

  const CategoryLasercut3 = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Станки лазерно-термического упрочнения',
      priority: 2,
      usersId: 0,
    },
  });

  const CategoryLasercut4 = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: '3D лазерные станки',
      priority: 3,
      usersId: 0,
    },
  });

  console.log({ Lasercut, CategoryLasercut1, CategoryLasercut2, CategoryLasercut3, CategoryLasercut4 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding languages...');

  const languages = [
    { name: 'C', slug: 'c', icon: 'SiC', color: '#A8B9CC', description: 'Systems programming.', sortOrder: 3 },
    { name: 'C++', slug: 'cpp', icon: 'SiCplusplus', color: '#00599C', description: 'High-performance applications.', sortOrder: 4 },
    { name: 'Java', slug: 'java', icon: 'SiJava', color: '#007396', description: 'Enterprise and Android development.', sortOrder: 5 },
    { name: 'TypeScript', slug: 'typescript', icon: 'SiTypescript', color: '#3178C6', description: 'Typed JavaScript.', sortOrder: 6 },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { slug: lang.slug },
      update: {},
      create: {
        ...lang,
        isActive: true,
      },
    });
  }

  console.log('Languages seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

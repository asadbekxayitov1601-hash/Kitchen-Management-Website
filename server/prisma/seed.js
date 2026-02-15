import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Alice Tester', email: 'alice@example.com', password: 'alicepass' },
    { name: 'Bob Tester', email: 'bob@example.com', password: 'bobpass' },
  ];

  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    let created = exists;
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10);
      created = await prisma.user.create({ data: { name: u.name, email: u.email, passwordHash: hash } });
      console.log('Created user', u.email);
    } else {
      console.log('User already exists', u.email);
    }
    // ensure sample pantry items exist
    const pcount = await prisma.pantryItem.count({ where: { userId: created.id } });
    if (pcount === 0) {
      await prisma.pantryItem.createMany({ data: [
        { userId: created.id, name: 'Salt', status: 'in-stock', category: 'Spices', quantity: '1 pack' },
        { userId: created.id, name: 'Milk', status: 'low', category: 'Dairy', quantity: '1L' },
      ]});
      console.log('Seeded pantry items for', u.email);
    }
    const scount = await prisma.shoppingItem.count({ where: { userId: created.id } });
    if (scount === 0) {
      await prisma.shoppingItem.createMany({ data: [
        { userId: created.id, name: 'Tomatoes', quantity: '2kg', recipeId: null, recipeName: null, checked: false },
      ]});
      console.log('Seeded shopping items for', u.email);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

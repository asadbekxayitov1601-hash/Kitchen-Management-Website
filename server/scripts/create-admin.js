import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
        console.log('Usage: node scripts/create-admin.js <email> <password> [name]');
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                isAdmin: true,
            },
        });
        console.log(`Admin user created: ${user.email}`);
    } catch (e) {
        if (e.code === 'P2002') {
            console.log('User already exists. Updating to admin...');
            const user = await prisma.user.update({
                where: { email },
                data: { isAdmin: true }
            });
            console.log(`User ${user.email} promoted to admin.`);
        } else {
            console.error(e);
        }
    }
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

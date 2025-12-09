const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hash = await bcrypt.hash('123456', 10);
    const user = await prisma.adminUser.create({
      data: {
        email: 'usuariaaceleradora@gmail.com',
        password: hash,
        role: 'ADMIN',
      },
    });
    console.log('Usuária criada com sucesso:', user);
  } catch (error) {
    console.error('Erro ao criar usuária:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

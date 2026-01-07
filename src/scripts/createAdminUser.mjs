import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "admin@test.com",
      provider: "local",
      loginDate: new Date(),
    },
  });

  console.log("Usuário criado:", user);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Erro ao criar usuário:", e);
    process.exit(1);
  });


  //node src/scripts/createAdminUser.mjs

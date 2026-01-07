import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "minha_chave_secreta";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@test.com" },
  });

  if (!user) {
    console.error("Usuário admin não encontrado!");
    process.exit(1);
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: "ADMIN", 
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  console.log("Token JWT gerado:");
  console.log(token);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Erro ao gerar token:", e);
    process.exit(1);
  });

  //node src/scripts/generateAdminToken.mjs

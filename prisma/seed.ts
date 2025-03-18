import { PrismaClient } from "@prisma/client"
import {mockedUser} from"../src/mocks/userMock"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({data: mockedUser})
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

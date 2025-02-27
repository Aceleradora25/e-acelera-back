import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: "usuariaaceleradora@gmail.com",
      provider: "google",
      loginDate: new Date(),
      Progress: {
        create: [
          {
            itemId: "rw17169056027059821dc",
            itemStatus: "InProgress",
            elementType: "Exercise",
            topicId: "rw1721236357157ccf465",
          },
          {
            itemId: "rw1716905602727ecf72e",
            itemStatus: "Completed",
            elementType: "Exercise",
            topicId: "rw1721236357157ccf465",
          },
          {
            itemId: "rw17256421537956df97b",
            itemStatus: "Completed",
            elementType: "Exercise",
            topicId: "rw1721236357157ccf465",
          },
          {
            itemId: "rw1725642159329a2d9f4",
            itemStatus: "Completed",
            elementType: "Exercise",
            topicId: "rw1721236357157ccf465",
          },
          {
            itemId: "rw172564217048038aaf4",
            itemStatus: "Completed",
            elementType: "Exercise",
            topicId: "rw1721236357157ccf465",
          },
          {
            itemId: "rw1725642166308a69249",
            itemStatus: "Completed",
            elementType: "Exercise",
            topicId: "rw1721236357157ccf465",
          },
          {
            itemId: "rw1725556521808c8761e",
            itemStatus: "Completed",
            elementType: "Video",
            topicId: "rw1721236357157ccf465",
          },
        ],
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

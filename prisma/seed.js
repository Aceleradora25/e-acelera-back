import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const themesIds = Array.from({ length: 20 }, () => faker.string.uuid());

async function main() {
  for (const themeId of themesIds) {
    const theme = await prisma.themes.create({
      data: {
        idThemes: themeId,
        title: capitalize(faker.book.title()),
        description: faker.lorem.lines(),
        image:"",
        category: faker.number.int({min:0, max:1})>0?"Nivelamento":"AutoEstudo", 
        sequence: faker.number.int({min:0, max:20}),
        alt:"",
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
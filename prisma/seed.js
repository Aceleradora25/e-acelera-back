import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const themesIds = Array.from({ length: 20 }, () => faker.string.uuid());
const topicsIds = Array.from({ length: 80 }, () => faker.string.uuid());

async function main() {
  for (const topicId of topicsIds) {
    const topic = {
      idTopics: topicId,
      title: capitalize(faker.book.title()),
      references: faker.lorem.lines(),
      cardDescription: faker.lorem.lines(),
      description: faker.lorem.lines(),
    }
    await prisma.topics.create({
      data: topic,
    });
  }
  for (const themeId of themesIds) {
    await prisma.themes.create({
      data: {
        idThemes: themeId,
        title: capitalize(faker.book.title()),
        description: faker.lorem.lines(),
        image: "",
        category: faker.number.int({ min: 0, max: 1 }) > 0 ? "Nivelamento" : "AutoEstudo",
        sequence: faker.number.int({ min: 0, max: 20 }),
        alt: "",
      },
    });
  }
  const themes = await prisma.themes.findMany();
  const topics = await prisma.topics.findMany();
  let topicIndex = 0;

  for (const theme of themes) {
    const topicsForTheme = topics.slice(topicIndex, topicIndex + 4);
    for (const topic of topicsForTheme) {
      await prisma.topics.update({
        where: { idTopics: topic.idTopics },
        data: { themeId: theme.idThemes },
      });
    }

    topicIndex += 4;
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
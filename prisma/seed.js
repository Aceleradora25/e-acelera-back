import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const themesIds = Array.from({ length: 20 }, () => faker.string.uuid());
const topicsIds = Array.from({ length: 80 }, () => faker.string.uuid());
const exercisesIds = Array.from({ length: 320 }, () => faker.string.uuid());
const videosIds = Array.from({ length: 80 }, () => faker.string.uuid());

async function main() {
  for (const videoId of videosIds) {
    const video = {
      id: videoId,
      title: capitalize(faker.book.title()),
      description: faker.lorem.lines(),
      references: faker.lorem.lines(),
      link: faker.lorem.lines(),
      // topic: "",
    };
    await prisma.video.create({
      data: video,
    });
  }
  for (const exerciseId of exercisesIds) {
    const exercise = {
      id: exerciseId,
      title: capitalize(faker.book.title()),
      shortDescription: faker.lorem.lines(),
      description: faker.lorem.lines(),
      // topic:"",
    };
    await prisma.exercise.create({
      data: exercise,
    });
  }
  for (const topicId of topicsIds) {
    const topic = {
      id: topicId,
      title: capitalize(faker.book.title()),
      references: faker.lorem.lines(),
      shortDescription: faker.lorem.lines(),
      description: faker.lorem.lines(),
      //theme: "",
      //exercises: "",
      //video: null
    };
    await prisma.topic.create({
      data: topic,
    });
  }
  for (const themeId of themesIds) {
    await prisma.theme.create({
      data: {
        id: themeId,
        title: capitalize(faker.book.title()),
        description: faker.lorem.lines(),
        shortDescription: faker.lorem.lines(),
        image: "",
        category:
          faker.number.int({ min: 0, max: 1 }) > 0 ? "Leveling" : "SelfStudy",
        sequence: faker.number.int({ min: 0, max: 20 }),
        alt: "",
        //topic: "",
      },
    });
  }

  const themes = await prisma.theme.findMany();
  const topics = await prisma.topic.findMany();
  const exercises = await prisma.exercise.findMany();
  const videos = await prisma.video.findMany();

  let topicIndex = 0;
  let exerciseIndex = 0;
  let videoIndex = 0

  for (const theme of themes) {
    const topicsForTheme = topics.slice(topicIndex, topicIndex + 4);
    for (const topic of topicsForTheme) {
      await prisma.topic.update({
        where: { id: topic.id },
        data: { themeId: theme.id },
      });
    }

    topicIndex += 4;
  }

  for (const topic of topics) {
    const exercisesForTopic = exercises.slice(exerciseIndex, exerciseIndex + 4);
    for (const exercise of exercisesForTopic) {
      await prisma.exercise.update({
        where: { id: exercise.id },
        data: { topicId: topic.id },
      });
    }

    exerciseIndex += 4;
  }


  for (const topic of topics) {
    const videoForTopic = videos.slice(videoIndex, videoIndex + 1).pop();
    await prisma.video.update({
      where: { id:  videoForTopic.id},
      data: { topicId: topic.id },
    });
    videoIndex += 1
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });

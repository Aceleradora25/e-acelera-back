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
      idVideos: videoId,
      title: capitalize(faker.book.title()),
      description: faker.lorem.lines(),
      references: faker.lorem.lines(),
      link: faker.lorem.lines(),
    }
    await prisma.videos.create({
    data: video,
  });
 }

  for (const exerciseId of exercisesIds) {
    const exercise = {
      idExercises: exerciseId,
      title: capitalize(faker.book.title()),
      cardDescription: faker.lorem.lines(),
      description: faker.lorem.lines(),
    }
    await prisma.exercises.create({
      data: exercise,
    });
  }
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
}

  const themes = await prisma.themes.findMany();
  const topics = await prisma.topics.findMany();
  const exercises = await prisma.exercises.findMany();
  const videos = await prisma.videos.findMany();
  let topicIndex = 0;
  let exerciseIndex = 0;
  

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

  for (const topic of topics) {
    const exercisesForTopic = exercises.slice(exerciseIndex, exerciseIndex + 4);
    for (const exercise of exercisesForTopic) {
      await prisma.exercises.update({
        where: { idExercises: exercise.idExercises },
        data: { topicId: topic.idTopics},
      });
    }

    for (const topic of topics) {
   const videosForTopic = videos.slice(videoIndex, videoIndex + 4);
    for (const video of videosForTopic) {
      await prisma.videos.update({
        where: { idVideos: video.idVideos },
        data: { topicId: topic.idTopics},
      });
    }                       

    videoIndex += 4;
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
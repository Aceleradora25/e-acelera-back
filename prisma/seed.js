import { PrismaClient, ThemeCategory } from "@prisma/client";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {parse} from "fast-csv"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), "data");

async function csvToJSON(filename) {
    return new Promise((resolve, reject) => {
        const parsedRows = [];

        fs.createReadStream(`${__dirname}/${filename}.csv`)
            .pipe(parse({ headers: true, ignoreEmpty: true, discardUnmappedColumns: true, trim: true}))
            .on('error', error => {
                console.error(error)
                reject(error)
            })
            .on('data', row => parsedRows.push(row))
            .on('end', () => resolve(parsedRows));
        })
}

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");


  await prisma.exercise.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.video.deleteMany();
  await prisma.theme.deleteMany();

  const themesData = await csvToJSON("themes")
  const topicsData = await csvToJSON("topics")
  const exercisesData = await csvToJSON("exercises")
  const videosData = await csvToJSON("videos")

  const themeTitleToId = new Map();
  const topicTitleToId = new Map();
  const videoTitleToId = new Map();

  let exerciseCount = 0;
  let themeCount = 0;

  const urlRegex = /\((https?:\/\/[^\s)]+)\)/;

  for (const theme of themesData) {
    const matchImageURL = theme.image.match(urlRegex);

    const createdTheme = await prisma.theme.create({
        data: {
          title: theme.title,
          description: theme.description,
          shortDescription: theme.cardDescription,
          image:  matchImageURL && matchImageURL.length > 1 ? matchImageURL[1] : "",
          category: theme.category === "Nivelamento" ? ThemeCategory.Leveling : ThemeCategory.SelfStudy,
          sequence: ++themeCount,
          alt: theme.alt,
        }
    });
    themeTitleToId.set(createdTheme.title, createdTheme.id);
  }

  for (const topic of topicsData) {
    const themeId = themeTitleToId.get(topic.themes);

    if (!themeId) {
      console.warn(`Tema não encontrado para tópico: ${topic.title}`);
      continue;
    }

    const createdTopic = await prisma.topic.create({
        data: {
          title: topic.title,
          shortDescription: topic.cardDescription,
          description: topic.description,
          references: topic.references,
          themeId,
        }
    });

    topicTitleToId.set(createdTopic.title, createdTopic.id);
  }

  for (const video of videosData) {
    const topicId = topicTitleToId.get(video.topics);
    if (!topicId) {
      console.warn(`Tópico não encontrado para vídeo: ${video.title}`);
      continue;
    }
    const createdVideo = await prisma.video.create({
        data: {
          title: video.title,
          description: video.description,
          references: video.references,
          link: video.link,
          topicId,
        }
    });

    videoTitleToId.set(createdVideo.title, createdVideo.id);
  }

  for (const exercise of exercisesData) {
    const topicId = topicTitleToId.get(exercise.topics);
    if (!topicId) {
      console.warn(`Tópico não encontrado para exercício: ${exercise.title}`);
      continue;
    }

   await prisma.exercise.create({
        data: {
          title: exercise.title,
          shortDescription: exercise.cardDescription,
          description: exercise.description,
          sequence: ++exerciseCount,
          topicId,
        }
    });

  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


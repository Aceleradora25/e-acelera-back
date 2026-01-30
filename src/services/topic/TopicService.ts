import prisma from "../../../client";
import { CreateTopicDTO } from "../../dtos/CreateTopic.dto";
import { UpdateTopicDTO } from "../../dtos/UpdateTopic.dto";

export class TopicService {
	async createTopic(dto: CreateTopicDTO) {
		const topic = await prisma.topic.create({
			data: {
				title: dto.title,
				description: dto.description,
				shortDescription: dto.shortDescription,
				references: dto.references,
				themeId: dto.themeId,
				isActive: true,
			},
		});
		return topic;
	}

	async getAllTopics() {
		return await prisma.topic.findMany({
			include: {
				exercises: true,
				theme: true,
				video: true,
			},
		});
	}

	async getTopicById(id: string) {
		return await prisma.topic.findUnique({
			include: {
				exercises: true,
				theme: true,
				video: true,
			},
			where: { id },
		});
	}

	async getTopicsByThemeId(themeId: string) {
		return await prisma.topic.findMany({
			include: {
				exercises: true,
				video: true,
			},
			where: { themeId },
		});
	}

	async updateTopic(id: string, dto: UpdateTopicDTO) {
		const existingTopic = await prisma.topic.findUnique({
			where: { id },
		});

		if (!existingTopic) {
			throw new Error("Topic not found");
		}

		const topic = await prisma.topic.update({
			where: { id },
			data: {
				...dto,
			},
		});

		return topic;
	}

	async deleteTopic(id: string) {
		const topic = await prisma.topic.update({
			where: { id },
			data: { isActive: false },
		});
		return topic;
	}
}

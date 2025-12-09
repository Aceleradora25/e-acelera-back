import prisma from "@/root/client.js";

export class TopicService {
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
}

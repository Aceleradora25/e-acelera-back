import type { AdminUser, Exercise, Theme, Topic, Video } from "@prisma/client";

export type ModelTypes = {
	Theme: Theme;
	Topic: Topic;
	Exercise: Exercise;
	Video: Video;
	AdminUser: AdminUser;
};

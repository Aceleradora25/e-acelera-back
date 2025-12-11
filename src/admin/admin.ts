import * as AdminJSExpress from "@adminjs/express";
import { Database, getModelByName, Resource } from "@adminjs/prisma";
import AdminJS from "adminjs";
import prisma from "../../client.js";
import { AdminUserResource } from "./resources/admin-user.resource.js";
import { ExerciseResource } from "./resources/exercise.resource.js";
import { ThemeResource } from "./resources/theme.resource.js";
import { TopicResource } from "./resources/topic.resource.js";
import { VideoResource } from "./resources/video.resource.js";

AdminJS.registerAdapter({ Database, Resource });

export const admin = new AdminJS({
	branding: {
		companyName: "Admin API",
		logo: false,
		withMadeWithLove: false,
	},
	pages: {},
	resources: [
		{
			...AdminUserResource,
			resource: { client: prisma, model: getModelByName("AdminUser") },
		},
		{
			...ThemeResource,
			resource: { client: prisma, model: getModelByName("Theme") },
		},
		{
			...TopicResource,
			resource: { client: prisma, model: getModelByName("Topic") },
		},
		{
			...ExerciseResource,
			resource: { client: prisma, model: getModelByName("Exercise") },
		},
		{
			...VideoResource,
			resource: { client: prisma, model: getModelByName("Video") },
		},
	],
	rootPath: "/admin",
});

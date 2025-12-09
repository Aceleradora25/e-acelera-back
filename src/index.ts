import "reflect-metadata";
import AdminJSExpress from "@adminjs/express";
import { Database, getModelByName, Resource } from "@adminjs/prisma";
import AdminJS from "adminjs";
import bcrypt from "bcryptjs";
import Connect from "connect-pg-simple";
import cors from "cors";
import express from "express";
import session from "express-session";
import { errorHandlerMiddleware } from "@/middlewares/errorHandlerMiddleware.js";
import prisma from "@/root/client.js";
import router from "@/routes/index.js";

const PORT = 5002;
AdminJS.registerAdapter({ Database, Resource });

type ActionRequest = {
	payload?: Record<string, any>;
	[key: string]: any;
};

const authenticate = async (email: string, password: string) => {
	const user = await prisma.adminUser.findUnique({ where: { email } });
	if (user && (await bcrypt.compare(password, user.password))) {
		return user;
	}
	return null;
};

const start = async () => {
	const adminOptions = {
		resources: [
			{
				options: {
					actions: {
						edit: {
							before: async (request: ActionRequest) => {
								if (request.payload?.password) {
									request.payload.password = await bcrypt.hash(
										request.payload.password,
										10,
									);
								}
								return request;
							},
						},
						new: {
							before: async (request: ActionRequest) => {
								if (request.payload?.password) {
									request.payload.password = await bcrypt.hash(
										request.payload.password,
										10,
									);
								}
								return request;
							},
						},
					},
					properties: {
						password: {
							isVisible: {
								edit: true,
								filter: false,
								list: false,
								show: false,
							},
							type: "password",
						},
						role: {
							availableValues: [
								{ label: "Admin", value: "ADMIN" },
								{ label: "Editor", value: "EDITOR" },
								{ label: "Viewer", value: "VIEWER" },
							],
						},
					},
				},
				resource: { client: prisma, model: getModelByName("AdminUser") },
			},
			{
				options: {},
				resource: { client: prisma, model: getModelByName("User") },
			},
			{
				options: {},
				resource: { client: prisma, model: getModelByName("Progress") },
			},
			{
				options: {},
				resource: { client: prisma, model: getModelByName("Theme") },
			},
			{
				options: {},
				resource: { client: prisma, model: getModelByName("Topic") },
			},
			{
				options: {},
				resource: { client: prisma, model: getModelByName("Exercise") },
			},
			{
				options: {},
				resource: { client: prisma, model: getModelByName("Video") },
			},
		],
		rootPath: "/admin",
	};

	const app = express();
	const admin = new AdminJS(adminOptions);

	const ConnectSession = Connect(session);
	const sessionStore = new ConnectSession({
		conObject: {
			connectionString: process.env.DATABASE_URL,
			ssl: process.env.NODE_ENV === "production",
		},
		createTableIfMissing: true,
		tableName: "session",
	});

	app.use(express.json());
	app.use(
		cors({
			credentials: true,
			origin: "http://localhost:3000",
		}),
	);

	const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
		admin,
		{
			authenticate,
			cookieName: "adminjs",
			cookiePassword: "sessionsecret",
		},
		null,
		{
			cookie: {
				httpOnly: process.env.NODE_ENV === "production",
				secure: process.env.NODE_ENV === "production",
			},
			name: "adminjs",
			resave: true,
			saveUninitialized: true,
			secret: "sessionsecret",
			store: sessionStore,
		},
	);

	app.use(admin.options.rootPath, adminRouter);
	app.use(router);
	app.use(errorHandlerMiddleware);

	app.use((req, res) => {
		res.status(404).json({
			error: "Not Found",
			message: "A rota que você tentou acessar não existe.",
			status: 404,
		});
	});

	app.listen(PORT, () => {
		console.log(
			`Server is running on port http://localhost:${PORT}${admin.options.rootPath}`,
		);
	});
};

start();

import "reflect-metadata";
import express from "express";
import router from "./routes/index";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import Connect from 'connect-pg-simple';
import session from 'express-session';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import prisma from '../client';
import cors from "cors";
import bcrypt from "bcryptjs";

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
        resource: { model: getModelByName('AdminUser'), client: prisma },
        options: {
          properties: {
            password: { 
              isVisible: { list: false, edit: true, filter: false, show: false },
              type: 'password',
            },
            role: { 
              availableValues: [
                { value: 'ADMIN', label: 'Admin' },
                { value: 'EDITOR', label: 'Editor' },
                { value: 'VIEWER', label: 'Viewer' },
              ],
            },
          },
          actions: {
            new: {
              before: async (request: ActionRequest) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
            edit: {
              before: async (request: ActionRequest) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
          },
        },
      },
      { resource: { model: getModelByName('User'), client: prisma }, options: {} },
      { resource: { model: getModelByName('Progress'), client: prisma }, options: {} },
      { resource: { model: getModelByName('Theme'), client: prisma }, options: {} },
      { resource: { model: getModelByName('Topic'), client: prisma }, options: {} },
      { resource: { model: getModelByName('Exercise'), client: prisma }, options: {} },
      { resource: { model: getModelByName('Video'), client: prisma }, options: {} },
    ],
    rootPath: '/admin',
  };

  const app = express();
  const admin = new AdminJS(adminOptions);

  const ConnectSession = Connect(session);
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
  });

  app.use(express.json());
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  app.use(router);
  app.use(errorHandlerMiddleware);

  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      error: "Not Found",
      message: "A rota que você tentou acessar não existe.",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}${admin.options.rootPath}`);
  });
};

start();

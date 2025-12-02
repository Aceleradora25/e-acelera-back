import "reflect-metadata";
import express from "express";
import router from "./routes/index";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import Connect from 'connect-pg-simple'
import session from 'express-session'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import prisma from '../client';
import MarkdownField from "./adminjs/components/markdownField.js";

const PORT = 5002;
AdminJS.registerAdapter({ Database, Resource })

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const start = async () => {

    const adminOptions = {
    resources: [{
      resource: { model: getModelByName('User'), client: prisma },
      options: {
        properties: {
          email: {
          type: 'textarea', 
          props: {
            rows: 5, 
          },
          },
          provider: {
            type: 'textarea',
            props: { rows: 3 },
          }
        }
      }
    }, {
      resource: { model: getModelByName('Progress'), client: prisma },
      options: {},
    }, {
      resource: { model: getModelByName('Theme'), client: prisma },
      options: {},
    }, {
      resource: { model: getModelByName('Topic'), client: prisma },
      options: {},
    }, {
      resource: { model: getModelByName('Exercise'), client: prisma },
      options: {},
    }, {
      resource: { model: getModelByName('Video'), client: prisma },
      options: {},
    },
  ],
  }

  const app = express();
  const admin = new AdminJS(adminOptions);

  const ConnectSession = Connect(session)
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
  })

  app.use(express.json());

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
  )
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
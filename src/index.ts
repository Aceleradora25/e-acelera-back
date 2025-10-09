import "reflect-metadata";
//import express from "express";
//import router from "./routes/index";
//import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
//import AdminJS from 'adminjs'
//import AdminJSExpress from '@adminjs/express'
import { Request, Response } from "express";

import { PrismaClient } from '@prisma/client'

// Use a sintaxe CommonJS (require) para consistência com AdminJS v6
const express = require('express');
const { Sequelize, Model } = require('sequelize');
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const { Request, Response } = require("express");
const { Database, Resource } = require('@adminjs/sequelize');

// Importe suas rotas e middlewares
const router = require('./routes/index'); // Ajuste o caminho se necessário
const { errorHandlerMiddleware } = require('./middleware/errorHandlerMiddleware'); // Ajuste o caminho

// --- 1. Conexão com o Banco de Dados via Sequelize ---
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/e-acelera', {
  dialect: 'postgres',
});

// --- 2. Registro do Adaptador do Sequelize ---
// Isso "ensina" o AdminJS a entender os modelos do Sequelize.
AdminJS.registerAdapter({ 
    Adapter: AdminJSSequelize,
    Database: Sequelize,
    Resource: Model
});

// --- 3. Importe seus Modelos do Sequelize ---
const UserModel = require('./models/user')(sequelize);
const ThemeModel = require('./models/theme')(sequelize);
const TopicModel = require('./models/topic')(sequelize);
const ProgressModel = require('./models/progress')(sequelize);

// Um Tema tem muitos Tópicos
ThemeModel.hasMany(TopicModel, { foreignKey: 'themeId' });
// Um Tópico pertence a um Tema
TopicModel.belongsTo(ThemeModel, { foreignKey: 'themeId' });

// Um Usuário pode ter progresso em muitos Tópicos/Temas
UserModel.hasMany(ProgressModel, { foreignKey: 'userId' });
ProgressModel.belongsTo(UserModel, { foreignKey: 'userId' });

// O progresso pode estar relacionado a um Tópico
TopicModel.hasMany(ProgressModel, { foreignKey: 'topicId' });
ProgressModel.belongsTo(TopicModel, { foreignKey: 'topicId' });

// O progresso também pode estar relacionado a um Tema
ThemeModel.hasMany(ProgressModel, { foreignKey: 'themeId' });
ProgressModel.belongsTo(ThemeModel, { foreignKey: 'themeId' });


// --- 4. Função Principal (async) ---
const start = async () => {
  const app = express();
  const port = 5002;

  // --- 5. Configuração do AdminJS ---
  const admin = new AdminJS({
    resources: [
      // Agora passamos os modelos do Sequelize para o AdminJS
      { resource: UserModel, options: { /* ... */ } },
      { resource: ThemeModel, options: { /* ... */ } },
      { resource: TopicModel, options: { /* ... */ } },
      { resource: ProgressModel, options: { /* ... */ } },
    ],
    
    rootPath: '/admin', // A URL para acessar o painel
    branding: {
      companyName: 'E-Acelera',
    },
  });

  // Cria as rotas do AdminJS
  const adminRouter = AdminJSExpress.buildRouter(admin);

  // --- 6. Configuração dos Middlewares do Express ---
  // Adiciona o roteador do AdminJS ao Express
  app.use(admin.options.rootPath, adminRouter);

  // Adiciona os middlewares do seu aplicativo
  app.use(express.json());
  app.use(router); // Suas rotas da API (ex: /users, /posts)
  app.use(errorHandlerMiddleware); // Seu middleware de erro

  // Middleware para rotas não encontradas (404)
  app.use(function(req: Request, res: Response) {
  res.status(404).json({
    status: 404,
    error: "Not Found",
    message: "A rota que você tentou acessar não existe.",
  });
});


  // --- 7. Inicia o Servidor (APENAS UMA VEZ) ---
  app.listen(port, () => {
    console.log(`Servidor principal rodando na porta ${port}`);
    console.log(`Painel AdminJS iniciado em http://localhost:${port}${admin.options.rootPath}` );
  });
};

// Executa a função principal
start();
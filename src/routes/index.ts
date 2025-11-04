import express from "express";
import { validateTokenMiddleware } from "../middleware/validateTokenMiddleware";
import { LoginController } from "../controllers/login/LoginController";
import { ProgressController } from "../controllers/progress/ProgressController";
import { StackbyController } from "../controllers/stackby/StackbyController";
import prisma from '../../client'
import { Router } from 'express';
import { Flagsmith } from 'flagsmith-nodejs';

if (!process.env.FLAGSMITH_SERVER_KEY) {
  throw new Error("FATAL: A variável de ambiente FLAGSMITH_SERVER_KEY não está definida.");
}

const flagsmith = new Flagsmith({
  environmentKey: process.env.FLAGSMITH_SERVER_KEY!,
});

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the homepage");
});

// router.get("/themes", async (req, res) => {
//   try {
//     const result = await prisma.query("SELECT * FROM themes ORDER BY sequence");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erro ao buscar os temas" });
//   }
// });

// router.post("/login", (req, res) =>
//   new LoginController().registerUser(req, res)
// );








router.get("/themes", async (req, res) => {
  try{
    const themes = await prisma.themes.findMany({
      orderBy:{
        sequence:'asc'
      },
    });
    res.json(themes);
  } catch(err){
    console.error("Erro ao buscar temas", err);
    res.status(500).json({error: "ocorreu erro."})
  }
});




 router.get("/stackby/:endpoint", (req, res, next) =>
  new StackbyController().getStackbyData(req, res, next)
);

router.get("/themes",
  (req, res) =>
    new StackbyController().getFilteredThemes(req, res)
);










router.use(validateTokenMiddleware);

router.get("/status/:id/:idType", (req, res) =>
  new ProgressController().getTopicExercisesStatusProgress(req, res)
);

router.put("/status/:topicId/item/:itemId", (req, res) =>
  new ProgressController().saveStatusProgress(req, res)
);

router.get("/status/:topicId/item/:itemId", (req, res) =>
  new ProgressController().getExerciseStatusProgress(req, res)
);

router.get("/progress/:id/:idType", (req, res) =>
  new ProgressController().getProgressPercentageById(req, res)
);

router.get("/themes/progress", (req, res) =>
  new ProgressController().getThemeProgress(req, res)
);




router.post('/user-preferences', async (req, res) => {
  const flagsmithServerKey = process.env.FLAGSMITH_SERVER_KEY;
  if (!flagsmithServerKey) {
    return res.status(500).json({ error: "Configuração do servidor incompleta." });
  }

  const { key, value, userId } = req.body;
  if (!userId || !key || value === undefined) {
    return res.status(400).json({ error: "Campos 'userId', 'key', e 'value' são obrigatórios." });
  }

  try {
    const apiUrl = "https://edge.api.flagsmith.com/api/v1/identities/";
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-environment-key': flagsmithServerKey,
      },
      body: JSON.stringify({
        identifier: userId,
        traits: [{ trait_key: key, trait_value: value }],
      } ),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: "Falha ao salvar no serviço de preferências.", details: errorData });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


export default router;



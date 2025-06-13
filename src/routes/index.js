// routes/index.js

import express from "express";
import { newsHandler } from "../controllers/newsController.js";
import { newHandler } from "../controllers/newController.js";
import { todayHandler } from "../controllers/todayController.js";
import { latestHandler } from "../controllers/latestController.js";

const router = express.Router();
const apiV1Router = express.Router();

// Definir rotas na versão v1
apiV1Router.get("/latest", latestHandler);
apiV1Router.get("/today", todayHandler);
apiV1Router.get("/news", newsHandler);
apiV1Router.get("/new", newHandler);

// Montar o roteador v1 no prefixo /api/v1
router.use("/api/v1", apiV1Router);

export default router;

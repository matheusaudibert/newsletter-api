import express from "express";
import { newsHandler } from "../controllers/newsController.js";
import { newHandler } from "../controllers/newController.js";
import { todayHandler } from "../controllers/todayController.js";
import { latestHandler } from "../controllers/latestController.js";

const router = express.Router();
const apiV1Router = express.Router();

// Rota para /api/v1 que retorna informações das rotas disponíveis
apiV1Router.get("/", (req, res) => {
  res.json({
    message: "Newsletter API",
    routes: [
      { route: "/latest", description: "Última notícia" },
      { route: "/today", description: "Notícias de hoje" },
      { route: "/news", description: "Todas as notícias" },
      { route: "/new?id", description: "Nova notícia" },
    ],
  });
});

// Definir rotas v1
apiV1Router.get("/latest", latestHandler);
apiV1Router.get("/today", todayHandler);
apiV1Router.get("/news", newsHandler);
apiV1Router.get("/new", newHandler);

// Montar o roteador v1 no prefixo /api/v1
router.use("/api/v1", apiV1Router);

export default router;

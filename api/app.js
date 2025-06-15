import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Permitir CORS para todos os domínios
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/", routes);

// Configuração para servir o frontend (build do Vite)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../dist");

app.use(express.static(frontendPath));

// Para qualquer rota que não seja API, retorna o index.html do frontend
app.get("*", (req, res, next) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    message: "A rota solicitada não existe nesta API",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

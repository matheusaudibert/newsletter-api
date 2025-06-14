// app.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Permitir CORS para todos os domínios (ou especifique apenas o necessário)
app.use(cors());

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

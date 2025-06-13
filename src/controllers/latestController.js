// controllers/latestController.js

import { fetchLatestNews } from "../services/tabnewsService.js";

function formatDatePtBr(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function latestHandler(req, res) {
  try {
    const { strategy } = req.query;
    const data = await fetchLatestNews(strategy);

    // Verificar se temos um resultado
    if (data.count > 0 && data.results && data.results.length > 0) {
      const first = data.results[0];
      // Adicionar campo 'date' formatado em português
      return res.json({
        ...first,
        date: formatDatePtBr(first.published_at),
      });
    } else {
      // Caso não haja resultados
      return res.status(404).json({ error: "Nenhuma notícia encontrada" });
    }
  } catch (error) {
    console.error("Erro na rota /latest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

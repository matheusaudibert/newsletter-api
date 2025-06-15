// controllers/todayController.js

import { parseDateParams } from "../utils/dateUtils.js";
import { fetchNewsByDate } from "../services/tabnewsService.js";

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

export async function todayHandler(req, res) {
  try {
    // Extrair parâmetros
    const { day, month, year } = req.query;

    // Se não houver data especificada, usar data atual
    const date = parseDateParams(day, month, year) || new Date();

    // Buscar dados
    const data = await fetchNewsByDate(date);

    // Adicionar campo 'date' formatado em português, mantendo a ordem dos campos
    const resultsWithDate = data.results.map((item) => {
      const { id, slug, title, body, source_url, url, published_at } = item;

      return {
        id,
        slug,
        title,
        body,
        source_url,
        url,
        published_at,
        date: formatDatePtBr(published_at),
      };
    });

    // Retornar resposta sem incluir a estratégia
    return res.json({
      count: resultsWithDate.length,
      results: resultsWithDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

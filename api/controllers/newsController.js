// controllers/newsController.js

import { parseDateParams } from "../utils/dateUtils.js";
import {
  fetchNewsByDate,
  fetchNewsByPage,
} from "../services/tabnewsService.js";

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

export async function newsHandler(req, res) {
  try {
    // Extrair todos os parâmetros de consulta
    const { day, month, year, page = 1, strategy = "new" } = req.query;

    // Caso 1: Busca por data (dia, mês, ano)
    const date = parseDateParams(day, month, year);
    if (date) {
      const data = await fetchNewsByDate(date);

      // Ordenar os resultados conforme strategy (new = mais recente primeiro, old = mais antigo primeiro)
      let sortedResults = data.results;
      if (strategy === "old") {
        sortedResults = sortedResults.sort(
          (a, b) => new Date(a.published_at) - new Date(b.published_at)
        );
      } else {
        sortedResults = sortedResults.sort(
          (a, b) => new Date(b.published_at) - new Date(a.published_at)
        );
      }

      // Adicionar campo 'date' formatado em português
      sortedResults = sortedResults.map((item) => ({
        ...item,
        date: formatDatePtBr(item.published_at),
      }));

      return res.json({
        page: 1,
        count: sortedResults.length,
        results: sortedResults,
      });
    }

    // Caso 2: Paginação normal - busca apenas uma página por vez
    const pageData = await fetchNewsByPage(page);

    // Ordenar os resultados conforme strategy
    let sortedResults = pageData.results;
    if (strategy === "old") {
      sortedResults = sortedResults.sort(
        (a, b) => new Date(a.published_at) - new Date(b.published_at)
      );
    } else {
      sortedResults = sortedResults.sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      );
    }

    // Adicionar campo 'date' formatado em português
    sortedResults = sortedResults.map((item) => ({
      ...item,
      date: formatDatePtBr(item.published_at),
    }));

    return res.json({
      page: pageData.page,
      count: sortedResults.length,
      results: sortedResults,
    });
  } catch (error) {
    console.error("Erro na rota /news:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

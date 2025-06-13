// controllers/newController.js

import { fetchNewsById } from "../services/tabnewsService.js";

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

export async function newHandler(req, res) {
  try {
    const { id } = req.query;

    // Validar presença do ID
    if (id === undefined) {
      return res.status(400).json({
        error: "ID obrigatório",
        message: "O parâmetro 'id' é obrigatório",
      });
    }

    const targetId = parseInt(id);

    // Validar formato do ID
    if (isNaN(targetId)) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID deve ser um número válido",
      });
    }

    // Buscar notícia completa pelo ID
    const newsItem = await fetchNewsById(targetId);

    if (!newsItem) {
      return res.status(404).json({
        error: "Notícia não encontrada",
        message: `Não foi possível encontrar notícia com ID: ${id}`,
      });
    }

    // Adicionar campo 'date' formatado em português
    return res.json({
      ...newsItem,
      date: formatDatePtBr(newsItem.published_at),
    });
  } catch (error) {
    console.error("Erro na rota /new:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

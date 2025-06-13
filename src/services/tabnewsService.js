// services/tabnewsService.js
// Funções para scraping e parsing do TabNews

import axios from "axios";
import * as cheerio from "cheerio";
import {
  BASE_URL,
  USERNAME,
  REQUEST_DELAY_MS,
  CONCURRENCY,
  DEFAULT_STRATEGY,
} from "../config.js";
import { isSameDayISO, parseDateParams } from "../utils/dateUtils.js";
import { convertLinksToMarkdown } from "../utils/htmlUtils.js";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Função base para buscar conteúdos da página específica
 * @param {number} pageNum
 * @param {string} strategy
 */
async function scrapePage(pageNum, strategy = DEFAULT_STRATEGY) {
  const url = `${BASE_URL}/${USERNAME}/conteudos/${pageNum}`;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const results = [];

  $("li.Box-sc-g0xbh4-0").each((_, el) => {
    const a = $(el).find(`a[href^='/${USERNAME}/']`).first();
    const title = a.text().trim();
    const href = a.attr("href");
    const published_at = $(el).find("time").attr("datetime");

    if (title && href && published_at) {
      results.push({
        title,
        slug: href.split("/").pop(),
        url: `${BASE_URL}${href}`,
        published_at,
      });
    }
  });

  return results;
}

/**
 * Descobre a última página para scraping (para rota /latest ou /all)
 */
async function discoverLastPage() {
  try {
    // Permitir redirecionamentos e extrair a URL final
    const res = await axios.get(`${BASE_URL}/${USERNAME}/conteudos/9999`, {
      maxRedirects: 5, // Permitir redirecionamentos
    });

    // Obter o número da página a partir da URL final
    const currentUrl = res.request.res.responseUrl || "";
    const match = currentUrl.match(/conteudos\/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  } catch (error) {
    console.error("Erro ao descobrir última página:", error.message);
    return 1; // Fallback para página 1
  }
}

/**
 * Busca todas notícias usando concorrência (usado por /latest e /all)
 */
export async function fetchAllNews(strategy = DEFAULT_STRATEGY) {
  const lastPage = await discoverLastPage();
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  const allNews = [];

  for (let i = 0; i < pages.length; i += CONCURRENCY) {
    const chunk = pages.slice(i, i + CONCURRENCY);
    const resultsChunk = await Promise.all(
      chunk.map((page) => scrapePage(page, strategy))
    );
    resultsChunk.forEach((pageResults) => allNews.push(...pageResults));
  }

  allNews.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  return allNews.map((item, idx) => ({
    id: idx,
    slug: item.slug,
    title: item.title,
    url: item.url,
    published_at: item.published_at,
  }));
}

/**
 * Busca apenas a página 1, ideal para a rota /daily
 */
async function fetchPageOneNews(strategy = DEFAULT_STRATEGY) {
  const pageOne = await scrapePage(1, strategy);

  return pageOne
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .map((item, idx) => ({
      id: idx,
      slug: item.slug,
      title: item.title,
      url: item.url,
      published_at: item.published_at,
    }));
}

/**
 * Busca uma página específica de notícias
 * @param {number} pageNum - Número da página (começa em 1)
 * @param {string} strategy - Estratégia de ordenação ("new" ou "old")
 * @returns {Promise<Array>} - Lista de notícias da página
 */
export async function fetchNewsByPage(
  pageNum = 1,
  strategy = DEFAULT_STRATEGY
) {
  try {
    // Validar página
    const requestedPage = Math.max(1, parseInt(pageNum) || 1);

    // Descobre o número total de páginas
    const lastPage = await discoverLastPage();

    // Limita a página solicitada ao número máximo disponível
    const page = Math.min(requestedPage, lastPage);

    // Buscar conteúdo da página
    const pageResults = await scrapePage(page, strategy);

    // Mapear resultados com IDs calculados
    // Assumimos 30 itens por página em média
    const baseId = (page - 1) * 30;

    return {
      page: page, // Retorna a página real que foi acessada
      count: pageResults.length,
      results: pageResults.map((item, idx) => ({
        id: baseId + idx,
        slug: item.slug,
        title: item.title,
        url: item.url,
        published_at: item.published_at,
      })),
    };
  } catch (error) {
    console.error(`Erro ao buscar página ${pageNum}:`, error.message);
    return {
      page: 1, // Em caso de erro, retornamos página 1
      count: 0,
      results: [],
    };
  }
}

/**
 * Busca notícias de um dia específico (usada por /today)
 * Apenas da página 1
 * @param {Date} date
 * @param {string} strategy - Estratégia de ordenação ("new" ou "old")
 */
export async function fetchNewsByDate(
  date = new Date(),
  strategy = DEFAULT_STRATEGY
) {
  // Validar strategy
  const validStrategy = ["new", "old"].includes(strategy)
    ? strategy
    : DEFAULT_STRATEGY;

  const pageOneNews = await fetchPageOneNews(validStrategy);

  const filtered = pageOneNews.filter((item) =>
    isSameDayISO(item.published_at, date)
  );

  // Ordenar os resultados com base na estratégia
  let sortedFiltered = [...filtered];
  if (validStrategy === "new") {
    sortedFiltered.sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );
  } else {
    sortedFiltered.sort(
      (a, b) => new Date(a.published_at) - new Date(b.published_at)
    );
  }

  const results = [];

  for (const [index, item] of sortedFiltered.entries()) {
    try {
      const res = await axios.get(item.url);
      const $ = cheerio.load(res.data);
      const rawBodyHtml = $(".markdown-body").first().html() || "";
      const body = convertLinksToMarkdown(rawBodyHtml);
      const source_url = $("a[rel=nofollow]").attr("href") || "";

      results.push({
        id: index,
        slug: item.slug,
        title: item.title,
        body,
        source_url,
        url: item.url,
        published_at: new Date(item.published_at).toISOString(),
      });

      if (index < sortedFiltered.length - 1) {
        await sleep(REQUEST_DELAY_MS); // espera só entre múltiplos
      }
    } catch (err) {
      console.error(`Erro ao processar ${item.url}:`, err.message);
    }
  }

  return {
    count: results.length,
    results,
  };
}

/**
 * Busca a última notícia publicada (a mais recente, da página 1)
 * @param {string} strategy
 */
export async function fetchLatestNews(strategy = DEFAULT_STRATEGY) {
  try {
    // Busca apenas a página 1 onde está a notícia mais recente
    const pageOneNews = await fetchPageOneNews(strategy);

    // Se não houver notícias, retorne array vazio
    if (pageOneNews.length === 0) {
      return {
        count: 0,
        results: [],
      };
    }

    // A notícia mais recente será a primeira (já ordenadas por data)
    const latestNews = pageOneNews[0];

    try {
      // Buscar conteúdo detalhado da notícia mais recente
      const res = await axios.get(latestNews.url);
      const $ = cheerio.load(res.data);
      const rawBodyHtml = $(".markdown-body").first().html() || "";
      const body = convertLinksToMarkdown(rawBodyHtml);
      const source_url = $("a[rel=nofollow]").attr("href") || "";

      // Retorna detalhes completos apenas da notícia mais recente
      return {
        count: 1,
        results: [
          {
            id: 0,
            slug: latestNews.slug,
            title: latestNews.title,
            body,
            source_url,
            url: latestNews.url,
            published_at: new Date(latestNews.published_at).toISOString(),
          },
        ],
      };
    } catch (err) {
      console.error(
        `Erro ao processar detalhes da notícia mais recente:`,
        err.message
      );
      // Se falhar ao buscar detalhes, retorna informações básicas
      return {
        count: 1,
        results: [latestNews],
      };
    }
  } catch (error) {
    console.error("Erro ao buscar notícia mais recente:", error);
    return {
      count: 0,
      results: [],
      error: "Falha ao buscar notícia mais recente",
    };
  }
}

/**
 * Estima em qual página um ID específico deve estar
 * @param {number} id - ID do post
 * @returns {number} - Número estimado da página
 */
export function estimatePageForId(id) {
  // Assumimos 30 itens por página em média
  return Math.floor(id / 30) + 1;
}

/**
 * Busca uma notícia específica por ID com conteúdo completo
 * @param {number} id - ID da notícia
 * @param {string} strategy - Estratégia de ordenação
 * @returns {Promise<Object>} - Notícia encontrada ou null
 */
export async function fetchNewsById(id, strategy = DEFAULT_STRATEGY) {
  try {
    // Estima a página onde o ID deve estar
    const estimatedPage = estimatePageForId(id);
    const targetId = parseInt(id);

    // Buscar a página estimada
    const { results } = await fetchNewsByPage(estimatedPage, strategy);

    // Procurar o ID nesta página
    let newsItem = results.find((item) => item.id === targetId);

    // Se não encontrou, tenta nas páginas adjacentes
    if (!newsItem) {
      // Tentar a página anterior
      if (estimatedPage > 1) {
        const { results: prevResults } = await fetchNewsByPage(
          estimatedPage - 1,
          strategy
        );
        newsItem = prevResults.find((item) => item.id === targetId);
      }

      // Se ainda não encontrou, tenta a próxima página
      if (!newsItem) {
        const { results: nextResults } = await fetchNewsByPage(
          estimatedPage + 1,
          strategy
        );
        newsItem = nextResults.find((item) => item.id === targetId);
      }
    }

    // Se encontrou o item, busca os detalhes completos
    if (newsItem) {
      try {
        const res = await axios.get(newsItem.url);
        const $ = cheerio.load(res.data);
        const rawBodyHtml = $(".markdown-body").first().html() || "";
        const body = convertLinksToMarkdown(rawBodyHtml);
        const source_url = $("a[rel=nofollow]").attr("href") || "";

        return {
          id: newsItem.id,
          slug: newsItem.slug,
          title: newsItem.title,
          body,
          source_url,
          url: newsItem.url,
          published_at: new Date(newsItem.published_at).toISOString(),
        };
      } catch (err) {
        console.error(`Erro ao buscar detalhes para ID ${id}:`, err.message);
        return newsItem; // Retorna sem detalhes em caso de erro
      }
    }

    return null; // Retorna null se não encontrou
  } catch (error) {
    console.error(`Erro ao buscar notícia com ID ${id}:`, error.message);
    return null;
  }
}

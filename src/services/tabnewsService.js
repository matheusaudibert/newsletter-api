// services/tabnewsService.js
// Funções para scraping e parsing do TabNews

import axios from "axios";
import * as cheerio from "cheerio";
import { isSameDayISO } from "../utils/dateUtils.js";
import { convertLinksToMarkdown } from "../utils/htmlUtils.js";

// Configurações do scraping
const BASE_URL = "https://www.tabnews.com.br";
const USERNAME = "NewsletterOficial";
const DEFAULT_STRATEGY = "new";
const CONCURRENCY = 3; // Número de requisições paralelas

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Obtém o número total de postagens do TabNews
 * @returns {Promise<number>} - Número total de postagens
 */
export async function getTotalPostsCount() {
  try {
    const url = `${BASE_URL}/${USERNAME}/conteudos/1`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Busca o elemento que contém o contador total de posts
    const counterElement = $(
      "span.prc-CounterLabel-CounterLabel-ZwXPe"
    ).first();
    const countText = counterElement.text();

    // Converte para número e garante que seja válido
    const count = parseInt(countText, 10);
    return isNaN(count) ? 0 : count;
  } catch (error) {
    console.error("Erro ao obter contagem total de posts:", error.message);
    return 0;
  }
}

/**
 * Calcula o ID baseado no número total de posts
 * @param {number} totalPosts - Número total de posts
 * @param {number} index - Índice do item na lista (0-based)
 * @returns {number} - ID calculado
 */
export function calculatePostId(totalPosts, index) {
  return Math.max(0, totalPosts - 1 - index);
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
        slug: href.split("/").pop(),
        title,
        url: BASE_URL + href,
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
      maxRedirects: 5,
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
  const totalPosts = await getTotalPostsCount();

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
    id: calculatePostId(totalPosts, idx),
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
  const totalPosts = await getTotalPostsCount();

  return pageOne
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .map((item, idx) => ({
      id: calculatePostId(totalPosts, idx),
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

    // Buscar o número total de posts
    const totalPosts = await getTotalPostsCount();

    // Mapear resultados com IDs baseados no número total de posts
    const postsPerPage = 30;
    const startIndex = (page - 1) * postsPerPage;

    return {
      page: page,
      count: pageResults.length,
      results: pageResults.map((item, idx) => ({
        id: calculatePostId(totalPosts, startIndex + idx),
        slug: item.slug,
        title: item.title,
        url: item.url,
        published_at: item.published_at,
      })),
    };
  } catch (error) {
    console.error(`Erro ao buscar página ${pageNum}:`, error.message);
    return {
      page: 1,
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
  const totalPosts = await getTotalPostsCount();

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
      // Extrair conteúdo completo da notícia
      const url = item.url;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Seletores atualizados para extrair conteúdo
      // Buscar o conteúdo principal - tenta múltiplos seletores possíveis
      let content = "";
      // Tenta primeiro o seletor principal
      content = $("article .prose").html();

      // Se não encontrou, tenta seletores alternativos
      if (!content) {
        content = $("article div[class*='markdown']").html();
      }

      if (!content) {
        content = $("article div[class*='content']").html();
      }

      // Último recurso: pegar todo o conteúdo do artigo
      if (!content) {
        content = $("article").html();
      }

      const body = content
        ? convertLinksToMarkdown(content).trim()
        : "Conteúdo não disponível";

      // Buscar URL da fonte original com seletor específico para links externos
      let source_url = "";

      // Primeira tentativa: buscar link externo específico com rel="nofollow"
      const specificExternalLinks = $(
        "a.prc-Link-Link-85e08[rel='nofollow'][href^='http']"
      );
      if (specificExternalLinks.length) {
        source_url = specificExternalLinks.first().attr("href") || "";
      }

      // Se não encontrou com o seletor específico, tenta outras alternativas
      if (!source_url) {
        const firstLink = $("article .prose a[href^='http']").first();
        if (firstLink.length) {
          source_url = firstLink.attr("href") || "";
        }
      }

      if (!source_url) {
        const anyLink = $(
          "article div[class*='markdown'] a[href^='http']"
        ).first();
        if (anyLink.length) {
          source_url = anyLink.attr("href") || "";
        }
      }

      if (!source_url) {
        const articleLink = $("article a[href^='http']").first();
        if (articleLink.length) {
          source_url = articleLink.attr("href") || "";
        }
      }

      // Adicionar à lista
      results.push({
        id: calculatePostId(totalPosts, index),
        slug: item.slug,
        title: item.title,
        body,
        source_url,
        url: item.url,
        published_at: new Date(item.published_at).toISOString(),
      });

      // Pausa entre requisições
      await sleep(100);
    } catch (err) {
      console.error(`Erro ao processar item ${item.slug}:`, err.message);
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
    const totalPosts = await getTotalPostsCount();

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
      // Extrair conteúdo completo da última notícia
      const url = latestNews.url;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Seletores atualizados para extrair conteúdo
      // Buscar o conteúdo principal - tenta múltiplos seletores possíveis
      let content = "";
      // Tenta primeiro o seletor principal
      content = $("article .prose").html();

      // Se não encontrou, tenta seletores alternativos
      if (!content) {
        content = $("article div[class*='markdown']").html();
      }

      if (!content) {
        content = $("article div[class*='content']").html();
      }

      // Último recurso: pegar todo o conteúdo do artigo
      if (!content) {
        content = $("article").html();
      }

      const body = content
        ? convertLinksToMarkdown(content).trim()
        : "Conteúdo não disponível";

      // Buscar URL da fonte original com seletor específico para links externos
      let source_url = "";

      // Primeira tentativa: buscar link externo específico com rel="nofollow"
      const specificExternalLinks = $(
        "a.prc-Link-Link-85e08[rel='nofollow'][href^='http']"
      );
      if (specificExternalLinks.length) {
        source_url = specificExternalLinks.first().attr("href") || "";
      }

      // Se não encontrou com o seletor específico, tenta outras alternativas
      if (!source_url) {
        const firstLink = $("article .prose a[href^='http']").first();
        if (firstLink.length) {
          source_url = firstLink.attr("href") || "";
        }
      }

      if (!source_url) {
        const anyLink = $(
          "article div[class*='markdown'] a[href^='http']"
        ).first();
        if (anyLink.length) {
          source_url = anyLink.attr("href") || "";
        }
      }

      if (!source_url) {
        const articleLink = $("article a[href^='http']").first();
        if (articleLink.length) {
          source_url = articleLink.attr("href") || "";
        }
      }

      // Retorna detalhes completos apenas da notícia mais recente
      return {
        count: 1,
        results: [
          {
            id: totalPosts - 1, // Mais recente é o último ID
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
        `Erro ao processar conteúdo da notícia ${latestNews.slug}:`,
        err.message
      );
      return {
        count: 1,
        results: [latestNews],
        error: "Falha ao processar conteúdo completo",
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
 * @param {number} totalPosts - Número total de posts
 * @returns {number} - Número estimado da página
 */
export function estimatePageForId(id, totalPosts) {
  const postsPerPage = 30;
  // Calcula em qual página o ID deve estar considerando o total de posts
  return Math.floor((totalPosts - 1 - id) / postsPerPage) + 1;
}

/**
 * Busca uma notícia específica por ID com conteúdo completo
 * @param {number} id - ID da notícia
 * @param {string} strategy - Estratégia de ordenação
 * @returns {Promise<Object>} - Notícia encontrada ou null
 */
export async function fetchNewsById(id, strategy = DEFAULT_STRATEGY) {
  try {
    const totalPosts = await getTotalPostsCount();
    const targetId = parseInt(id);

    // Verifica se o ID está dentro do intervalo válido
    if (targetId < 0 || targetId >= totalPosts) {
      return null;
    }

    // Estima a página onde o ID deve estar
    const estimatedPage = estimatePageForId(targetId, totalPosts);

    // Buscar a página estimada
    const { results } = await fetchNewsByPage(estimatedPage, strategy);

    // Procurar o ID nesta página
    let newsItem = results.find((item) => item.id === targetId);

    // Se não encontrou, tenta nas páginas adjacentes
    if (!newsItem) {
      // Tenta na página anterior
      if (estimatedPage > 1) {
        const { results: prevResults } = await fetchNewsByPage(
          estimatedPage - 1,
          strategy
        );
        newsItem = prevResults.find((item) => item.id === targetId);
      }

      // Se ainda não encontrou, tenta na próxima página
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
        const url = newsItem.url;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Seletores atualizados para extrair conteúdo
        // Buscar o conteúdo principal - tenta múltiplos seletores possíveis
        let content = "";
        // Tenta primeiro o seletor principal
        content = $("article .prose").html();

        // Se não encontrou, tenta seletores alternativos
        if (!content) {
          content = $("article div[class*='markdown']").html();
        }

        if (!content) {
          content = $("article div[class*='content']").html();
        }

        // Último recurso: pegar todo o conteúdo do artigo
        if (!content) {
          content = $("article").html();
        }

        const body = content
          ? convertLinksToMarkdown(content).trim()
          : "Conteúdo não disponível";

        // Buscar URL da fonte original com seletor específico para links externos
        let source_url = "";

        // Primeira tentativa: buscar link externo específico com rel="nofollow"
        const specificExternalLinks = $(
          "a.prc-Link-Link-85e08[rel='nofollow'][href^='http']"
        );
        if (specificExternalLinks.length) {
          source_url = specificExternalLinks.first().attr("href") || "";
        }

        // Se não encontrou com o seletor específico, tenta outras alternativas
        if (!source_url) {
          const firstLink = $("article .prose a[href^='http']").first();
          if (firstLink.length) {
            source_url = firstLink.attr("href") || "";
          }
        }

        if (!source_url) {
          const anyLink = $(
            "article div[class*='markdown'] a[href^='http']"
          ).first();
          if (anyLink.length) {
            source_url = anyLink.attr("href") || "";
          }
        }

        if (!source_url) {
          const articleLink = $("article a[href^='http']").first();
          if (articleLink.length) {
            source_url = articleLink.attr("href") || "";
          }
        }

        return {
          ...newsItem,
          body,
          source_url,
          published_at: new Date(newsItem.published_at).toISOString(),
        };
      } catch (err) {
        console.error(
          `Erro ao processar conteúdo da notícia ${newsItem.slug}:`,
          err.message
        );
        return newsItem;
      }
    }

    return null; // Retorna null se não encontrou
  } catch (error) {
    console.error(`Erro ao buscar notícia com ID ${id}:`, error.message);
    return null;
  }
}

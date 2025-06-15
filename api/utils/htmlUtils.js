// utils/htmlUtils.js
// Funções para manipulação de HTML, ex: converter links em markdown

import * as cheerio from "cheerio";

/**
 * Funções utilitárias para processamento de HTML
 */

/**
 * Converte links HTML em links no formato Markdown
 * Melhora a extração do conteúdo HTML para formato de texto
 * @param {string} html - HTML a ser convertido
 * @returns {string} - Texto com links em formato Markdown
 */
export function convertLinksToMarkdown(html) {
  if (!html) return "";

  // Substitui quebras de linha HTML por quebras de linha normais
  let text = html.replace(/<br\s*\/?>/gi, "\n");

  // Remove tags script e style com seu conteúdo
  text = text.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Converte links <a href="...">texto</a> para [texto](link)
  text = text.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    "[$2]($1)"
  );

  // Converte tags de imagem <img src="..." alt="..."/> para ![alt](src)
  text = text.replace(
    /<img\s+(?:[^>]*?\s+)?src="([^"]*)"(?:[^>]*?\s+)?alt="([^"]*)"[^>]*\/?>/gi,
    "![$2]($1)"
  );
  text = text.replace(
    /<img\s+(?:[^>]*?\s+)?alt="([^"]*)"(?:[^>]*?\s+)?src="([^"]*)"[^>]*\/?>/gi,
    "![$1]($2)"
  );

  // Converte headers
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n");
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n");
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n");
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n");
  text = text.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n");
  text = text.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n");

  // Converte elementos <p> em parágrafos com quebras de linha
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");

  // Converte <strong> e <b> em **texto**
  text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");

  // Converte <em> e <i> em *texto*
  text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");

  // Converte <code> em `código`
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Converte <pre> em blocos de código
  text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```");

  // Remove todas as outras tags HTML
  text = text.replace(/<[^>]+>/g, "");

  // Decodifica entidades HTML
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // Remove espaços em branco excessivos e quebras de linha
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

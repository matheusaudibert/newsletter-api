// utils/htmlUtils.js
// Funções para manipulação de HTML, ex: converter links em markdown

import * as cheerio from "cheerio";

/**
 * Recebe um HTML string e converte links <a> para markdown [text](url)
 * @param {string} html
 * @returns {string}
 */
export function convertLinksToMarkdown(html) {
  const $ = cheerio.load(html);

  $("a").each((_, el) => {
    const text = $(el).text();
    const href = $(el).attr("href");
    $(el).replaceWith(`[${text}](${href})`);
  });

  return $.root().text().trim();
}

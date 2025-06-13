// config.js
// Configurações gerais do projeto

export const BASE_URL = "https://www.tabnews.com.br";
export const USERNAME = "NewsletterOficial";
export const DEFAULT_STRATEGY = "new";

// Ajustado para evitar erro 429
export const REQUEST_DELAY_MS = 1000; // Aumento leve para evitar 429
export const CONCURRENCY = 3; // Reduzido para evitar muitas requisições paralelas

// Configurações para retry
export const MAX_RETRIES = 3;
export const RETRY_DELAY_BASE = 2000;
export const RETRY_DELAY_MAX = 30000;

// Headers para imitar navegador
export const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive",
};

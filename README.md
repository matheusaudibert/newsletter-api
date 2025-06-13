# 🚀 Newsletter API - Filipe Deschamps

Acesse de forma simples, rápida e gratuita as notícias mais quentes da [Newsletter de Tecnologia do Filipe Deschamps](https://filipedeschamps.com.br/newsletter), publicadas oficialmente no [TabNews](https://www.tabnews.com.br/NewsletterOficial).

> **Transforme sua aplicação, bot ou site em uma central de novidades tech!**

---

## ✨ O que é?

A Newsletter API é uma interface REST que permite consultar, filtrar e integrar as notícias da newsletter do Filipe Deschamps diretamente do TabNews, sem precisar de scraping ou autenticação.

- **Atualização automática:** Sempre com as últimas notícias.
- **Fácil integração:** Respostas em JSON, prontas para uso.
- **Grátis e aberta:** Use à vontade, sem limites de requisições.

---

## 🌐 Endereço Base

```
https://audibert.dev/newsletter/api/v1
```

---

## 📚 Rotas Disponíveis

### 🔥 `GET /latest`

Retorna a notícia mais recente publicada.

**Exemplo de resposta:**

```json
{
  "id": 0,
  "slug": "pesquisadores-descobrem-primeira-falha-zero-click-em-um-modelo-de-linguagem",
  "title": "Pesquisadores descobrem primeira falha zero-click em um modelo de linguagem",
  "body": "A vulnerabilidade CVE-2025-32711 foi identificada no Microsoft 365 Copilot, ...",
  "source_url": "https://www.bleepingcomputer.com/news/security/zero-click-ai-data-leak-flaw-uncovered-in-microsoft-365-copilot/",
  "url": "https://www.tabnews.com.br/NewsletterOficial/pesquisadores-descobrem-primeira-falha-zero-click-em-um-modelo-de-linguagem",
  "published_at": "2025-06-13T12:24:12.669Z",
  "date": "sexta-feira, 13 de junho de 2025 às 09:24"
}
```

---

### 📅 `GET /today`

Retorna todas as notícias publicadas no dia atual (da meia-noite até agora).

**Exemplo de resposta:**

```json
{
  "count": 2,
  "results": [
    {
      "id": 0,
      "slug": "pesquisadores-descobrem-primeira-falha-zero-click-em-um-modelo-de-linguagem",
      "title": "Pesquisadores descobrem primeira falha zero-click em um modelo de linguagem",
      "body": "...",
      "source_url": "...",
      "url": "...",
      "published_at": "...",
      "date": "..."
    },
    // ...
  ]
}
```

---

### 📰 `GET /news?page=1`

Retorna todas as notícias, paginadas (30 por página).  
Parâmetro opcional: `page` (padrão: 1).

**Exemplo de resposta:**

```json
{
  "page": 1,
  "count": 30,
  "results": [
    {
      "id": 0,
      "slug": "...",
      "title": "...",
      "url": "...",
      "published_at": "...",
      "date": "..."
    }
    // ...até o id 29
  ]
}
```

---

### 🔎 `GET /new?id={id}`

Retorna os detalhes completos de uma notícia específica pelo seu `id`.

**Exemplo de resposta:**

```json
{
  "id": 45,
  "slug": "...",
  "title": "...",
  "body": "...",
  "source_url": "...",
  "url": "...",
  "published_at": "...",
  "date": "..."
}
```

---

## 🏷️ Campos das Respostas

- **id:** Identificador único da notícia.
- **slug:** URL amigável da notícia.
- **title:** Título da notícia.
- **body:** Corpo/texto completo da notícia (quando disponível).
- **source_url:** Link para a fonte original da notícia.
- **url:** Link direto para a notícia no TabNews.
- **published_at:** Data/hora ISO da publicação.
- **date:** Data formatada em português.

---

## 💡 Exemplos de Integração

### Bash (cURL)

```bash
curl https://audibert.dev/newsletter/api/v1/latest
```

### JavaScript (fetch)

```js
fetch('https://audibert.dev/newsletter/api/v1/today')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Python (requests)

```python
import requests
resp = requests.get('https://audibert.dev/newsletter/api/v1/news?page=2')
print(resp.json())
```

---

## ❓ FAQ

- **Preciso de autenticação?**  
  Não! A API é pública e gratuita.

- **Tem limite de requisições?**  
  Não há limites definidos, mas use com responsabilidade.

- **Posso usar comercialmente?**  
  Sim, mas cite a fonte e respeite os termos do TabNews e da newsletter.

- **Como reportar bugs ou sugerir melhorias?**  
  Abra uma issue neste repositório.

---

## ⚡ Dicas & Boas Práticas

- Sempre cheque se o campo `body` está presente (algumas rotas não retornam o texto completo).
- Use a paginação para evitar sobrecarga e garantir performance.
- Para buscar notícias de datas específicas, utilize a rota `/news` e filtre pelo campo `date` no seu código.

---

## 👨‍💻 Créditos & Fontes

- Conteúdo original: [Filipe Deschamps](https://filipedeschamps.com.br)
- Notícias: [TabNews - NewsletterOficial](https://www.tabnews.com.br/NewsletterOficial)
- API por: [audibert.dev](https://audibert.dev)

---

## ⭐ Gostou? Contribua!

- Compartilhe, sugira melhorias ou contribua com código/documentação!
- [Siga o Filipe Deschamps](https://www.youtube.com/@FilipeDeschamps) para mais conteúdo tech.

---

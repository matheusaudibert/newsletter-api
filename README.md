# Newsletter API

API desenvolvida para acesso direto às notícias da [Newsletter de Tecnologia do Filipe Deschamps](https://filipedeschamps.com.br/newsletter), publicadas oficialmente no [TabNews](https://www.tabnews.com.br/NewsletterOficial).

Ideal para desenvolvedores, entusiastas de tecnologia e empresas que desejam consumir, integrar ou analisar os conteúdos da newsletter de forma automática, prática e confiável.

## Referência

- Conteúdo original: [Filipe Deschamps](https://filipedeschamps.com.br)
- Notícias: [TabNews - NewsletterOficial](https://www.tabnews.com.br/NewsletterOficial)

## Documentação da API

Base URL: `https://audibert.dev/newsletter/api/v1`

### Retorna a notícia mais recente

```http
GET /newsletter/api/v1/latest
```

**Exemplo de resposta:**

```json
{
  "id": 0,
  "slug": "slug-de-uma-noticia",
  "title": "Títutlo de uma notícia",
  "body": "Corpo da notícia",
  "source_url": "https://www.link-da-fonte.com",
  "url": "https://www.tabnews.com.br/NewsletterOficial/slug",
  "published_at": "Timestamp em ISO",
  "date": "Data formatada em português"
}
```

### Retorna todas as notícias do dia atual

```http
GET /newsletter/api/v1/today
```

**Exemplo de resposta:**

```json
{
  "count": 2,
  "results": [
    {
      "id": 0,
      "slug": "slug-de-uma-noticia",
      "title": "Títutlo de uma notícia",
      "body": "Corpo da notícia",
      "source_url": "https://www.link-da-fonte.com",
      "url": "https://www.tabnews.com.br/NewsletterOficial/slug",
      "published_at": "Timestamp em ISO",
      "date": "Data formatada em português"
    },
    {
      "id": 1,
      "slug": "slug-de-uma-noticia",
      "title": "Títutlo de uma notícia",
      "body": "Corpo da notícia",
      "source_url": "https://www.link-da-fonte.com",
      "url": "https://www.tabnews.com.br/NewsletterOficial/slug",
      "published_at": "Timestamp em ISO",
      "date": "Data formatada em português"
    }
  ]
}
```

### Retorna notícias paginadas

```http
GET /newsletter/api/v1/news?page=1
```

| Parâmetro | Tipo | Obrigatório | Descrição                    |
| --------- | ---- | :---------: | ---------------------------- |
| page      | int  |     Não     | Número da página (padrão: 1) |

**Exemplo de resposta:**

```json
{
  "page": 1,
  "count": 30,
  "results": [
    {
      "id": 0,
      "slug": "slug-de-uma-noticia",
      "title": "Títutlo de uma notícia",
      "url": "https://www.tabnews.com.br/NewsletterOficial/slug",
      "published_at": "Timestamp em ISO",
      "date": "Data formatada em português"
    }
    ...
  ]
}
```

### Retorna uma notícia específica por ID

```http
GET /newsletter/api/v1/new?id=45
```

| Parâmetro | Tipo | Obrigatório | Descrição              |
| --------- | ---- | :---------: | ---------------------- |
| id        | int  |     Sim     | ID da notícia desejada |

**Exemplo de resposta:**

```json
{
  "id": 0,
  "slug": "slug-de-uma-noticia",
  "title": "Títutlo de uma notícia",
  "body": "Corpo da notícia",
  "source_url": "https://www.link-da-fonte.com",
  "url": "https://www.tabnews.com.br/NewsletterOficial/slug",
  "published_at": "Timestamp em ISO",
  "date": "Data formatada em português"
}
```

## Campos das Respostas

- **id:** Identificador único da notícia.
- **slug:** Slug da notícia.
- **title:** Título da notícia.
- **body:** Corpo/texto completo da notícia em formato markdown.
- **source_url:** Link para a fonte original da notícia.
- **url:** Link direto para a notícia no TabNews.
- **published_at:** Data/hora ISO da publicação.
- **date:** Data formatada em português.

## FAQ

- **De onde vêm as notícias?**  
  Todas as notícias são extraídas do perfil oficial da newsletter no TabNews: [NewsletterOficial](https://www.tabnews.com.br/NewsletterOficial).

- **Preciso de autenticação?**  
  Não. A API é pública e gratuita.

- **Tem limite de requisições?**  
  Não há limites definidos, mas use com responsabilidade.

- **Posso usar comercialmente?**  
  Sim, mas cite a fonte e respeite os termos do TabNews e da newsletter.

- **Como reportar bugs ou sugerir melhorias?**  
  Abra uma issue neste repositório.

---

## ⭐ Gostou? Contribua!

- Favorite, Compartilhe, sugira melhorias ou contribua com código/documentação!
- [Siga o Filipe Deschamps](https://www.youtube.com/@FilipeDeschamps) para mais conteúdo tech.

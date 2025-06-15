import React, { useState } from "react";
import { Copy, Check, ExternalLink, Bot, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeExample {
  language: string;
  code: string;
}

interface APIRoute {
  id: string;
  method: string;
  endpoint: string;
  title: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  examples: CodeExample[];
  staticResponse: any;
}

const staticResponses = {
  latest: {
    id: 4096,
    slug: "ate-2027-metade-das-organizacoes-deve-abandonar-planos-de-substituir-equipes-de-atendimento-ao-cliente-por-ia-segundo-gartner",
    title:
      "Até 2027, metade das organizações deve abandonar planos de substituir equipes de atendimento ao cliente por IA, segundo Gartner",
    body: "Uma pesquisa conduzida pela Gartner em março com 163 líderes de atendimento e suporte ao cliente indica que 95% planejam manter agentes humanos em suas operações. Como consequência, estima-se que até 2027 cerca de 50% das organizações que pretendiam reduzir suas equipes de atendimento irão abandonar esses planos.\n\nEssa mudança de estratégia reflete as dificuldades enfrentadas por muitas empresas em atingir metas de atendimento totalmente automatizado, evidenciando a complexidade da transição para modelos centrados exclusivamente em IA.\n\nDe acordo com a diretora sênior de análise da divisão de Atendimento e Suporte ao Cliente da Gartner, o contato humano permanece insubstituível em diversas interações, sendo fundamental equilibrar tecnologia com empatia e compreensão humanas. Ela destaca que a abordagem híbrida, na qual IA e agentes humanos atuam em conjunto, é a estratégia mais eficaz para oferecer experiências excepcionais aos clientes.\n\nEsse alinhamento é crucial para aprimorar o atendimento sem comprometer a qualidade, garantindo que a IA funcione como um complemento, e não um substituto, da interação humana.",
    source_url:
      "https://www.gartner.com/en/newsroom/press-releases/2025-06-10-gartner-predicts-50-percent-of-organizations-will-abandon-plans-to-reduce-customer-service-workforce-due-to-ai",
    url: "https://www.tabnews.com.br/NewsletterOficial/ate-2027-metade-das-organizacoes-deve-abandonar-planos-de-substituir-equipes-de-atendimento-ao-cliente-por-ia-segundo-gartner",
    published_at: "2025-06-14T01:03:56.765Z",
    date: "sábado, 14 de junho de 2025 às 01:03",
  },
  today: {
    count: 2,
    results: [
      {
        id: 4096,
        slug: "ate-2027-metade-das-organizacoes-deve-abandonar-planos-de-substituir-equipes-de-atendimento-ao-cliente-por-ia-segundo-gartner",
        title:
          "Até 2027, metade das organizações deve abandonar planos de substituir equipes de atendimento ao cliente por IA, segundo Gartner",
        body: "Uma pesquisa conduzida pela Gartner em março com 163 líderes de atendimento e suporte ao cliente indica que 95% planejam manter agentes humanos em suas operações. Como consequência, estima-se que até 2027 cerca de 50% das organizações que pretendiam reduzir suas equipes de atendimento irão abandonar esses planos.\n\nEssa mudança de estratégia reflete as dificuldades enfrentadas por muitas empresas em atingir metas de atendimento totalmente automatizado, evidenciando a complexidade da transição para modelos centrados exclusivamente em IA.\n\nDe acordo com a diretora sênior de análise da divisão de Atendimento e Suporte ao Cliente da Gartner, o contato humano permanece insubstituível em diversas interações, sendo fundamental equilibrar tecnologia com empatia e compreensão humanas. Ela destaca que a abordagem híbrida, na qual IA e agentes humanos atuam em conjunto, é a estratégia mais eficaz para oferecer experiências excepcionais aos clientes.\n\nEsse alinhamento é crucial para aprimorar o atendimento sem comprometer a qualidade, garantindo que a IA funcione como um complemento, e não um substituto, da interação humana.",
        source_url:
          "https://www.gartner.com/en/newsroom/press-releases/2025-06-10-gartner-predicts-50-percent-of-organizations-will-abandon-plans-to-reduce-customer-service-workforce-due-to-ai",
        url: "https://www.tabnews.com.br/NewsletterOficial/ate-2027-metade-das-organizacoes-deve-abandonar-planos-de-substituir-equipes-de-atendimento-ao-cliente-por-ia-segundo-gartner",
        published_at: "2025-06-14T01:03:56.765Z",
        date: "sábado, 14 de junho de 2025 às 01:03",
      },
      {
        id: 4095,
        slug: "trafego-web-por-dispositivos-moveis-atinge-recorde-de-64-por-cento",
        title: "Tráfego web por dispositivos móveis atinge recorde de 64%",
        body: "A participação dos smartphones no tráfego global da web alcançou um novo recorde, atingindo 64% no segundo trimestre de 2025 — mais que o dobro dos 31,1% registrados no primeiro trimestre de 2015. Desde meados de 2023, o crescimento tem sido contínuo, com novos recordes a cada trimestre.\n\nUm dos principais fatores por trás desse avanço é o uso crescente de dispositivos móveis na Ásia. De acordo com dados do Statcounter, 71,3% do tráfego web na região já é originado de smartphones, número que supera em 7 pontos percentuais a média global. Já na Europa e nas Américas, os dispositivos móveis representam cerca de 50% do tráfego.\n\nEntre os sistemas operacionais móveis, o Android lidera, sendo responsável por 72,7% do tráfego, enquanto o iOS responde por 26,9%.",
        source_url:
          "https://www.techspot.com/news/108305-global-mobile-web-traffic-hits-record-high-64.html",
        url: "https://www.tabnews.com.br/NewsletterOficial/trafego-web-por-dispositivos-moveis-atinge-recorde-de-64-por-cento",
        published_at: "2025-06-14T00:13:37.676Z",
        date: "sábado, 14 de junho de 2025 às 00:13",
      },
    ],
  },
  news: {
    page: 1,
    count: 30,
    results: [
      {
        id: 4096,
        slug: "ate-2027-metade-das-organizacoes-deve-abandonar-planos-de-substituir-equipes-de-atendimento-ao-cliente-por-ia-segundo-gartner",
        title:
          "Até 2027, metade das organizações deve abandonar planos de substituir equipes de atendimento ao cliente por IA, segundo Gartner",
        url: "https://www.tabnews.com.br/NewsletterOficial/ate-2027-metade-das-organizacoes-deve-abandonar-planos-de-substituir-equipes-de-atendimento-ao-cliente-por-ia-segundo-gartner",
        published_at: "2025-06-14T01:03:56.765Z",
        date: "sábado, 14 de junho de 2025 às 01:03",
      },
      {
        id: 4095,
        slug: "trafego-web-por-dispositivos-moveis-atinge-recorde-de-64-por-cento",
        title: "Tráfego web por dispositivos móveis atinge recorde de 64%",
        url: "https://www.tabnews.com.br/NewsletterOficial/trafego-web-por-dispositivos-moveis-atinge-recorde-de-64-por-cento",
        published_at: "2025-06-14T00:13:37.676Z",
        date: "sábado, 14 de junho de 2025 às 00:13",
      },
    ],
  },
  new: {
    id: 0,
    slug: "criando-um-usuario-para-as-publicacoes-oficiais-da-newsletter-do-filipe-deschamps-no-tabnews",
    title:
      "Criando um usuário para as publicações oficiais da Newsletter do Filipe Deschamps no TabNews",
    body: "Turma, a gente vai passar a publicar as notícias que saem diariamente na [**Newsletter do Filipe Deschamps**](https://filipedeschamps.com.br/newsletter) através desse novo usuário: [**NewsletterOficial**](https://www.tabnews.com.br/NewsletterOficial).\n\nA função principal dos posts do **NewsletterOficial** aqui no TabNews é para divulgar as fontes das notícias que publicamos na Newsletter que vai por email.\n\nAs postagens estavam sendo realizadas pela [**FlaviaCarvalho**](https://www.tabnews.com.br/FlaviaCarvalho), mas isso pode acabar confundindo alguns usuários, [como aconteceu aqui](https://www.tabnews.com.br/DanielPaulo/99659ca1-dfe4-4251-9e3a-245249c35d07).\n\nObrigado!",
    source_url: "https://filipedeschamps.com.br/newsletter",
    url: "https://www.tabnews.com.br/NewsletterOficial/criando-um-usuario-para-as-publicacoes-oficiais-da-newsletter-do-filipe-deschamps-no-tabnews",
    published_at: "2022-11-29T17:26:20.245Z",
    date: "terça-feira, 29 de novembro de 2022 às 17:26",
  },
};

const apiRoutes: APIRoute[] = [
  {
    id: "latest",
    method: "GET",
    endpoint: "/latest",
    title: "Notícia Mais Recente",
    description: "Retorna a notícia mais recente da newsletter.",
    staticResponse: staticResponses.latest,
    examples: [
      {
        language: "curl",
        code: `curl -X GET "https://newsletter.audibert.dev/api/v1/latest"`,
      },
      {
        language: "javascript",
        code: `fetch('https://newsletter.audibert.dev/api/v1/latest')
  .then(response => response.json())
  .then(data => console.log(data));`,
      },
      {
        language: "python",
        code: `import requests

response = requests.get('https://newsletter.audibert.dev/api/v1/latest')
data = response.json()
print(data)`,
      },
      {
        language: "php",
        code: `<?php
$response = file_get_contents('https://newsletter.audibert.dev/api/v1/latest');
$data = json_decode($response, true);
print_r($data);
?>`,
      },
      {
        language: "java",
        code: `import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://newsletter.audibert.dev/api/v1/latest"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
      },
    ],
  },
  {
    id: "today",
    method: "GET",
    endpoint: "/today",
    title: "Notícias de Hoje",
    description: "Retorna todas as notícias publicadas no dia de hoje.",
    staticResponse: staticResponses.today,
    examples: [
      {
        language: "curl",
        code: `curl -X GET "https://newsletter.audibert.dev/api/v1/today"`,
      },
      {
        language: "javascript",
        code: `fetch('https://newsletter.audibert.dev/api/v1/today')
  .then(response => response.json())
  .then(data => console.log(data));`,
      },
      {
        language: "python",
        code: `import requests

response = requests.get('https://newsletter.audibert.dev/api/v1/today')
data = response.json()
print(data)`,
      },
      {
        language: "php",
        code: `<?php
$response = file_get_contents('https://newsletter.audibert.dev/api/v1/today');
$data = json_decode($response, true);
print_r($data);
?>`,
      },
      {
        language: "java",
        code: `import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://newsletter.audibert.dev/api/v1/today"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
      },
    ],
  },
  {
    id: "news",
    method: "GET",
    endpoint: "/news",
    title: "Todas as Notícias",
    description: "Retorna todas as notícias com suporte a paginação.",
    staticResponse: staticResponses.news,
    parameters: [
      {
        name: "page",
        type: "number",
        required: false,
        description: "Número da página (padrão: 1)",
      },
    ],
    examples: [
      {
        language: "curl",
        code: `# Primeira página
curl -X GET "https://newsletter.audibert.dev/api/v1/news"

# Página específica
curl -X GET "https://newsletter.audibert.dev/api/v1/news?page=2"`,
      },
      {
        language: "javascript",
        code: `// Primeira página
fetch('https://newsletter.audibert.dev/api/v1/news')
  .then(response => response.json())
  .then(data => console.log(data));

// Página específica
fetch('https://newsletter.audibert.dev/api/v1/news?page=2')
  .then(response => response.json())
  .then(data => console.log(data));`,
      },
      {
        language: "python",
        code: `import requests

# Primeira página
response = requests.get('https://newsletter.audibert.dev/api/v1/news')
data = response.json()

# Página específica
response = requests.get('https://newsletter.audibert.dev/api/v1/news?page=2')
data = response.json()
print(data)`,
      },
      {
        language: "php",
        code: `<?php
// Primeira página
$response = file_get_contents('https://newsletter.audibert.dev/api/v1/news');
$data = json_decode($response, true);

// Página específica
$response = file_get_contents('https://newsletter.audibert.dev/api/v1/news?page=2');
$data = json_decode($response, true);
print_r($data);
?>`,
      },
      {
        language: "java",
        code: `import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();

// Primeira página
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://newsletter.audibert.dev/api/v1/news"))
    .build();

// Página específica
HttpRequest request2 = HttpRequest.newBuilder()
    .uri(URI.create("https://newsletter.audibert.dev/api/v1/news?page=2"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
      },
    ],
  },
  {
    id: "news-by-id",
    method: "GET",
    endpoint: "/new",
    title: "Notícia por ID",
    description: "Retorna uma notícia específica baseada no ID fornecido.",
    staticResponse: staticResponses.new,
    parameters: [
      {
        name: "id",
        type: "number",
        required: true,
        description: "ID único da notícia",
      },
    ],
    examples: [
      {
        language: "curl",
        code: `curl -X GET "https://newsletter.audibert.dev/api/v1/new?id=0"`,
      },
      {
        language: "javascript",
        code: `fetch('https://newsletter.audibert.dev/api/v1/new?id=0')
  .then(response => response.json())
  .then(data => console.log(data));`,
      },
      {
        language: "python",
        code: `import requests

response = requests.get('https://newsletter.audibert.dev/api/v1/new?id=0')
data = response.json()
print(data)`,
      },
      {
        language: "php",
        code: `<?php
$response = file_get_contents('https://newsletter.audibert.dev/api/v1/new?id=0');
$data = json_decode($response, true);
print_r($data);
?>`,
      },
      {
        language: "java",
        code: `import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://newsletter.audibert.dev/api/v1/new?id=0"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
      },
    ],
  },
];

const formatJSONWithColors = (
  obj: any,
  darkMode: boolean,
  indentLevel: number = 0
): JSX.Element[] => {
  const result: JSX.Element[] = [];
  const indent = "  ".repeat(indentLevel);

  if (Array.isArray(obj)) {
    result.push(
      <span
        key={`bracket-open-${indentLevel}`}
        className={darkMode ? "text-gray-300" : "text-gray-700"}
      >
        [
      </span>
    );

    obj.forEach((item, index) => {
      result.push(
        <span key={`newline-${indentLevel}-${index}`}>
          {"\n" + "  " + indent}
        </span>
      );
      if (typeof item === "object" && item !== null) {
        result.push(
          <span key={`object-${indentLevel}-${index}`}>
            {formatJSONWithColors(item, darkMode, indentLevel + 1)}
          </span>
        );
      } else {
        result.push(
          <span key={`item-${indentLevel}-${index}`}>
            {formatValue(item, darkMode)}
          </span>
        );
      }
      if (index < obj.length - 1) {
        result.push(
          <span
            key={`comma-${indentLevel}-${index}`}
            className={darkMode ? "text-gray-300" : "text-gray-700"}
          >
            ,
          </span>
        );
      }
    });

    result.push(
      <span key={`newline-close-${indentLevel}`}>{"\n" + indent}</span>
    );
    result.push(
      <span
        key={`bracket-close-${indentLevel}`}
        className={darkMode ? "text-gray-300" : "text-gray-700"}
      >
        ]
      </span>
    );
  } else if (typeof obj === "object" && obj !== null) {
    result.push(
      <span
        key={`brace-open-${indentLevel}`}
        className={darkMode ? "text-gray-300" : "text-gray-700"}
      >
        {"{"}
      </span>
    );

    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      result.push(
        <span key={`newline-${indentLevel}-${key}`}>
          {"\n" + "  " + indent}
        </span>
      );
      result.push(
        <span
          key={`key-${indentLevel}-${key}`}
          className={darkMode ? "text-blue-400" : "text-blue-600"}
        >
          "{key}"
        </span>
      );
      result.push(
        <span
          key={`colon-${indentLevel}-${key}`}
          className={darkMode ? "text-gray-300" : "text-gray-700"}
        >
          :
        </span>
      );

      if (typeof obj[key] === "object" && obj[key] !== null) {
        result.push(
          <span key={`value-object-${indentLevel}-${key}`}>
            {formatJSONWithColors(obj[key], darkMode, indentLevel + 1)}
          </span>
        );
      } else {
        result.push(
          <span key={`value-${indentLevel}-${key}`}>
            {formatValue(obj[key], darkMode)}
          </span>
        );
      }

      if (index < keys.length - 1) {
        result.push(
          <span
            key={`comma-${indentLevel}-${key}`}
            className={darkMode ? "text-gray-300" : "text-gray-700"}
          >
            ,
          </span>
        );
      }
    });

    result.push(
      <span key={`newline-close-${indentLevel}`}>{"\n" + indent}</span>
    );
    result.push(
      <span
        key={`brace-close-${indentLevel}`}
        className={darkMode ? "text-gray-300" : "text-gray-700"}
      >
        {"}"}
      </span>
    );
  }

  return result;
};

const formatValue = (value: any, darkMode: boolean): JSX.Element => {
  if (typeof value === "string") {
    // Escape \n to show literally
    const escapedValue = value.replace(/\n/g, "\\n");
    return (
      <span className={darkMode ? "text-green-400" : "text-green-600"}>
        "{escapedValue}"
      </span>
    );
  } else if (typeof value === "number") {
    return (
      <span className={darkMode ? "text-orange-400" : "text-orange-600"}>
        {value}
      </span>
    );
  } else if (typeof value === "boolean") {
    return (
      <span className={darkMode ? "text-purple-400" : "text-purple-600"}>
        {value.toString()}
      </span>
    );
  } else if (value === null) {
    return (
      <span className={darkMode ? "text-gray-500" : "text-gray-500"}>null</span>
    );
  }

  return <span>{String(value)}</span>;
};

const CodeBlock: React.FC<{
  code: string;
  language: string;
  darkMode: boolean;
}> = ({ code, language, darkMode }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre
        className={`${
          darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
        } p-4 rounded-lg overflow-x-auto text-sm`}
      >
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className={`absolute top-2 right-2 ${
          darkMode
            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const ResponseBlock: React.FC<{
  staticResponse: any;
  darkMode: boolean;
}> = ({ staticResponse, darkMode }) => {
  return (
    <div className="space-y-4">
      <h5
        className={`font-medium ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Resposta da API
      </h5>
      <div className="relative">
        <pre
          className={`${
            darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
          } p-4 rounded-lg text-sm overflow-x-auto scrollbar-thin ${
            darkMode
              ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
              : "scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: darkMode ? "#4b5563 #1f2937" : "#9ca3af #e5e7eb",
          }}
        >
          <code>{formatJSONWithColors(staticResponse, darkMode)}</code>
        </pre>
      </div>
    </div>
  );
};

const RouteCard: React.FC<{ route: APIRoute; darkMode: boolean }> = ({
  route,
  darkMode,
}) => {
  return (
    <Card
      className={`mb-8 ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="font-mono border-[#0070F3] text-[#0070F3]"
          >
            {route.method}
          </Badge>
          <code
            className={`text-sm px-2 py-1 rounded ${
              darkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {route.endpoint}
          </code>
        </div>
        <CardTitle className={darkMode ? "text-gray-100" : "text-gray-900"}>
          {route.title}
        </CardTitle>
        <CardDescription
          className={darkMode ? "text-gray-300" : "text-gray-600"}
        >
          {route.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {route.parameters && (
          <div className="mb-6">
            <h4
              className={`font-semibold mb-3 ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Parâmetros
            </h4>
            <div className="space-y-2">
              {route.parameters.map((param) => (
                <div
                  key={param.name}
                  className={`flex items-start gap-4 p-3 rounded ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <code
                    className={`text-sm font-mono px-2 py-1 rounded ${
                      darkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {param.name}
                  </code>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={param.required ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {param.required ? "obrigatório" : "opcional"}
                      </Badge>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {param.type}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {param.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="curl" className="w-full">
          <TabsList
            className={`grid grid-cols-5 w-full mb-4 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"
            }`}
          >
            <TabsTrigger
              value="curl"
              className={
                darkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
                  : ""
              }
            >
              cURL
            </TabsTrigger>
            <TabsTrigger
              value="javascript"
              className={
                darkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
                  : ""
              }
            >
              JavaScript
            </TabsTrigger>
            <TabsTrigger
              value="python"
              className={
                darkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
                  : ""
              }
            >
              Python
            </TabsTrigger>
            <TabsTrigger
              value="php"
              className={
                darkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
                  : ""
              }
            >
              PHP
            </TabsTrigger>
            <TabsTrigger
              value="java"
              className={
                darkMode
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
                  : ""
              }
            >
              Java
            </TabsTrigger>
          </TabsList>

          {route.examples.map((example) => (
            <TabsContent key={example.language} value={example.language}>
              <div className="space-y-4">
                <div>
                  <h5
                    className={`font-medium mb-2 ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Exemplo de Requisição
                  </h5>
                  <CodeBlock
                    code={example.code}
                    language={example.language}
                    darkMode={darkMode}
                  />
                </div>
                <ResponseBlock
                  staticResponse={route.staticResponse}
                  darkMode={darkMode}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface APIDocumentationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const APIDocumentation: React.FC<APIDocumentationProps> = ({
  darkMode,
  setDarkMode,
}) => {
  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-white"}`}>
      <div
        className={`max-w-4xl mx-auto p-6 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src="https://filipedeschamps.com.br/avatar-big.png"
                alt="Logo"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1
                  className={`text-4xl font-bold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Newsletter API
                </h1>
                <Badge className="bg-[#0070F3] hover:bg-[#0070F3]/90 text-white mt-2">
                  v1.0
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={
                  darkMode
                    ? "border-gray-600 text-gray-100 hover:bg-gray-800 bg-gray-900"
                    : "border-gray-300 text-gray-900 hover:bg-gray-50 bg-white"
                }
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <p
            className={`text-xl mb-4 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            API pública e gratuita para acessar as notícias da{" "}
            <a
              href="https://filipedeschamps.com.br/newsletter"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#0070F3] hover:text-[#0070F3]/80"
            >
              newsletter
            </a>{" "}
            de tecnologia do{" "}
            <a
              href="https://www.youtube.com/FilipeDeschamps"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold hover:text-[#0070F3] ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Filipe Deschamps
            </a>
          </p>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <Badge
              variant="outline"
              className="flex items-center gap-2 border-green-500 text-green-600"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              API Online
            </Badge>
            <Button
              variant="outline"
              size="sm"
              asChild
              className={
                darkMode
                  ? "border-gray-600 text-gray-100 hover:bg-gray-800 bg-gray-900"
                  : "border-gray-300 text-gray-900 hover:bg-gray-50 bg-white"
              }
            >
              <a
                href="https://github.com/matheusaudibert/newsletter-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white"
            >
              <a
                href="https://newsletterbot.audibert.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                </svg>
                Integrar ao Discord
              </a>
            </Button>
          </div>

          <Card
            className={`mb-8 ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={darkMode ? "text-gray-100" : "text-gray-900"}
              >
                URL Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code
                className={`text-lg px-4 py-2 rounded block ${
                  darkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                https://newsletter.audibert.dev/api/v1
              </code>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {apiRoutes.map((route) => (
            <div key={route.id} id={route.id}>
              <RouteCard route={route} darkMode={darkMode} />
            </div>
          ))}
        </div>

        <Card
          className={`mt-8 ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <CardHeader>
            <CardTitle className={darkMode ? "text-gray-100" : "text-gray-900"}>
              Informações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Limites de Taxa
              </h4>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Esta API é pública e gratuita, sem limites de taxa definidos.
              </p>
            </div>
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Formato de Resposta
              </h4>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Todas as respostas são retornadas em formato JSON.
              </p>
            </div>
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Suporte
              </h4>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Para dúvidas ou problemas, visite o repositório no{" "}
                <a
                  href="https://github.com/matheusaudibert/newsletter-api"
                  className="text-[#0070F3] hover:underline"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIDocumentation;

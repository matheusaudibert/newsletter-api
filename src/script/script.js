//Atulizar README.md com o número de leitores ativos da newsletter do Filipe Deschamps

import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

async function atualizarLeitoresNewsletter() {
  try {
    const url = "https://filipedeschamps.com.br/newsletter";
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html);
    const texto = $("strong.jsx-2e622836670a7198").first().text().trim();
    const match = texto.match(/([\d.]+)\s*leitores ativos/i);
    if (!match)
      throw new Error("Número de leitores ativos não encontrado no HTML");

    const numeroLeitores = match[1];
    console.log("Número de leitores ativos encontrado:", numeroLeitores);

    const readmePath = path.resolve(process.cwd(), "README.md");

    let readmeContent = await fs.readFile(readmePath, "utf-8");

    const regex =
      /(assinar%20newsletter-)([\d.,]+)(%20leitores%20ativos-ecd767)/i;

    if (!regex.test(readmeContent)) {
      throw new Error("Badge de newsletter não encontrado no README.md");
    }

    const novoBadge = `$1${numeroLeitores}$3`;
    const readmeAtualizado = readmeContent.replace(regex, novoBadge);

    await fs.writeFile(readmePath, readmeAtualizado, "utf-8");

    console.log("README.md atualizado com sucesso!");
  } catch (error) {}
}

atualizarLeitoresNewsletter();

// import { Request, Response } from "express";
// import { STATUS_CODE } from "../../utils/constants";
import express  from "express";


const app = express();

export async function getGithubApi(url: string) : Promise<any[]> {
   const response = await fetch(url);

    if (!response.ok) throw new Error("Erro ao buscar dados");

    const items = await response.json();
    let results: any[] = [];

    for (const item of items) {
      if (item.type === "file" && item.name.endsWith(".md")) {
        // Baixa o conteúdo do Markdown
        const fileResp = await fetch(item.download_url);
        const content = await fileResp.text();
        results.push({ name: item.name, path: item.path, content });
      } else if (item.type === "dir") {
        // Busca recursivamente subpastas
        const subResults = await getGithubApi(item.url);
        results = results.concat(subResults);
    }

    return results;
  }

  // Aqui você lista as pastas principais que quer buscar
  const baseUrl = "https://api.github.com/repos/TiciB/poc-eacelera/contents";
  const folders = ["temas", "topicos", "exercicio"];

  // Faz uma chamada para cada pasta e junta tudo
  const allFiles = (
    await Promise.all(folders.map(folder => getGithubApi(`${baseUrl}/${folder}`)))
  ).flat();

  console.log(allFiles);
  return allFiles;
}



// app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));


// Decodificar Base64
// const markdown = Buffer.from(data.content, "base64");
// const result = markdown.toString()
//console.log(data);
// return
// app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));

// getGithubApi().catch(console.error);
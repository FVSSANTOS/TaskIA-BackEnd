const axios = require("axios");
require("dotenv").config();

async function estimateTask(titulo, descricao) {
  if (!titulo) {
    return { prioridade: "baixa", esforco: "30 minutos" };
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) {
    return { prioridade: "baixa", esforco: "30 minutos" };
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Você é um assistente de gerenciamento de projetos.
Ao receber o título de uma tarefa, responda APENAS com um JSON válido,
sem nenhum texto adicional, sem markdown, sem explicações.
O formato deve ser exatamente:
{"prioridade": "", "esforco": ""}
Use apenas os valores Alta, Média ou Baixa para prioridade.
Use apenas um valor de tempo para esforço, como "30 minutos", "1 hora" ou "3 horas".
Título da tarefa: ${taskTitle}
Descrição da tarefa: ${taskDescription}
`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(endpoint, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const rawText = extractRawText(response.data);
    if (!rawText) {
      return { prioridade: "baixa", esforco: "30 minutos" };
    }

    const resultado = parseJsonFromText(rawText);
    if (!resultado) {
      console.warn(
        "IA retornou texto inesperado, fallback para baixa:",
        rawText,
      );
      return { prioridade: "baixa", esforco: "30 minutos" };
    }

    return resultado;
  } catch (error) {
    console.error(
      "Erro ao chamar a LLM:",
      error.response ? error.response.data : error.message,
    );
    return { prioridade: "baixa", esforco: "30 minutos" };
  }
}

function extractRawText(data) {
  if (!data) return null;

  if (typeof data === "string") return data;

  const candidateList = data?.candidates || [];
  for (const candidate of candidateList) {
    const content = candidate.content;
    if (!content) continue;

    if (Array.isArray(content)) {
      for (const item of content) {
        const text = item?.parts?.[0]?.text || item?.text;
        if (text) return text;
      }
    }

    const text = content?.parts?.[0]?.text || content?.text;
    if (text) return text;
  }

  if (data?.output?.[0]?.content) {
    for (const block of data.output[0].content) {
      if (typeof block.text === "string") return block.text;
    }
  }

  return null;
}

function parseJsonFromText(text) {
  if (typeof text !== "string") return null;

  const match = text.match(/{[\s\S]*}/);
  const target = match ? match[0] : text;

  try {
    return JSON.parse(target);
  } catch {
    const normalized = target
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
      .replace(/'/g, '"')
      .replace(/\s+\n/g, " ");

    try {
      return JSON.parse(normalized);
    } catch {
      return null;
    }
  }
}

module.exports = { estimateTask };

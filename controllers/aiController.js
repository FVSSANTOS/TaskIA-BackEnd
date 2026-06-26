const axios = require("axios");
require("dotenv").config();

async function estimateTask(titulo, descricao) {
  if (!titulo) {
    return "O campo 'titulo' é obrigatório.";
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!GOOGLE_API_KEY) {
    return "GOOGLE_API_KEY ou GEMINI_API_KEY não está configurada.";
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
O formato deve ser no padrão que está no exemplo abaixo:
{"prioridade": "", "esforco": ""}
Os valores de prioridade aceitos são: Alta, Média ou Baixa.
O esforco deve ser uma estimativa de tempo (ex: "30 minutos", "1 hora", "3 horas").
Título da tarefa: ${titulo}, Descrição da tarefa: ${descricao}
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

    // A resposta do Gemini 2.5 flash deve vir em um formato similar a:
    // { "candidates": [ { "content": { "parts": [ { "text": "{"prioridade": "Média", "esforco": "1 hora"}" } ] } } ] }
    const rawText = response.data.candidates[0].content.parts[0].text;
    const resultado = JSON.parse(rawText);

    return resultado;
  } catch (error) {
    console.error(
      "Erro ao chamar a LLM:",
      error.response ? error.response.data : error.message,
    );
    return "Falha ao obter estimativa da IA.";
  }
}

module.exports = { estimateTask };

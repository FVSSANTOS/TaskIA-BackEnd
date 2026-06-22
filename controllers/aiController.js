const OpenAI = require("openai"); // importei a biblioteca
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function estimateTask(req, res) {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: "O campo 'titulo' é obrigatório." });
  }

  try {
    const response = await openai.chat.completions.create({ // método da biblioteca que chama API da OpenAI
      model: "gpt-3.5-turbo", // modelo da IA utilizada
      messages: [ // array de mensagens que formam a conversa enviada para a IA. Funciona como um histórico de chat.
        {
          role: "system", // instrução de comportamento para a IA. É o System Prompt — define as regras, o que ela pode e não pode fazer, e o formato da resposta.
          content: `Você é um assistente de gerenciamento de projetos.
Ao receber o título de uma tarefa, responda APENAS com um JSON válido,
sem nenhum texto adicional, sem markdown, sem explicações.
O formato deve ser exatamente:
{"prioridade": "Alta", "esforco": "2 horas"}
Os valores de prioridade aceitos são: Alta, Média ou Baixa.
O esforco deve ser uma estimativa de tempo (ex: "30 minutos", "1 hora", "3 horas").`,
        },
        {
          role: "user",
          content: `Título da tarefa: ${titulo}`, // interpolação de string. Injeta o valor da variável titulo dentro do texto. É como colar o valor ali dentro.
        },
      ],
    });

    const rawText = response.choices[0].message.content.trim(); // array de respostas que a IA retornou
    const resultado = JSON.parse(rawText); // garante que é JSON válido

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao chamar a LLM:", error);
    return res.status(500).json({ error: "Falha ao obter estimativa da IA." });
  }
}

module.exports = { estimateTask };
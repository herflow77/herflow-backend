import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let userMessage = "";

    if (req.method === "GET") {
      userMessage = req.query?.message || "";
    } else if (req.method === "POST") {
      userMessage = req.body?.message || "";
    } else {
      return res.status(405).json({ error: "Kun GET og POST er tilladt" });
    }

    if (!userMessage.trim()) {
      return res.status(400).json({ error: "Ingen besked modtaget" });
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content:
            "Du er HerFlow, en varm og støttende assistent. Svar kort, roligt og hjælpsomt."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    return res.status(200).json({
      reply: response.output_text
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      error: "Noget gik galt på serveren"
    });
  }
}

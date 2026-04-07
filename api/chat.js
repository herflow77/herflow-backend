import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST er tilladt" });
  }

  try {
    const userMessage = req.body?.message || "";

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
    console.error(error);
    return res.status(500).json({
      error: "Noget gik galt"
    });
  }
}

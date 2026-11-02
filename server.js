import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: "Please send a message." });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "Add your OpenAI API key to the .env file to enable AI replies." });
    }
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-6",
        instructions: "You are Axis Intelligence, a helpful, clear, and thoughtful AI assistant. Be accurate and concise.",
        input: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "The AI service returned an error." });
    }
    const answer = data.output_text || (data.output || []).flatMap(x => x.content || []).map(x => x.text || "").join("\n");
    res.json({ answer: answer || "I couldn't generate a response. Please try again." });
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Axis Intelligence running at http://localhost:${port}`));

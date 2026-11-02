import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(root, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Send a message to begin." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "AI is not configured yet. Add OPENAI_API_KEY to your .env file and restart the app." });
  }
  const clean = messages.slice(-30).map(m => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: String(m?.content ?? "").slice(0, 12000)
  })).filter(m => m.content.trim());
  if (!clean.length) return res.status(400).json({ error: "Your message was empty." });

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        instructions: "You are AXIS Intelligence, a capable, clear, friendly AI assistant. Give useful, accurate answers. Be concise unless the user asks for detail.",
        input: clean.map(m => ({ role: m.role, content: [{ type: "input_text", text: m.content }] }))
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const msg = data?.error?.message || `AI request failed (${upstream.status}).`;
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({ error: msg });
    }
    const answer = data.output_text || (data.output || []).flatMap(item => item.content || []).map(c => c.text || "").join("\n");
    if (!answer) return res.status(502).json({ error: "The AI returned an empty response. Please try again." });
    res.json({ answer });
  } catch (err) {
    console.error("Chat request failed:", err?.message || err);
    res.status(500).json({ error: "Could not reach the AI service. Check your internet connection and try again." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(root, "public", "index.html")));
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`AXIS Intelligence running at http://localhost:${port}`));

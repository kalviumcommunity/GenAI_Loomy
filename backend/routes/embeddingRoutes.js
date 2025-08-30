// routes/embeddingRoutes.js
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);

    res.json({ embedding: result.embedding.values });
  } catch (err) {
    res.status(500).json({ error: "Embedding failed" });
  }
});

module.exports = router;

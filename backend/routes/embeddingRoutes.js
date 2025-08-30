const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { cosineSimilarity } = require("../utils/similarity"); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// in-memory "vector database"
let vectorDB = [];

// generate embedding
async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}


router.post("/add", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const embedding = await getEmbedding(text); 
    vectorDB.push({ text, embedding });

    console.log("📦 vectorDB now:", vectorDB.length, "items");

    res.json({ success: true, message: "Added to vectorDB", size: vectorDB.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to vectorDB" });
  }
});


//  Search text
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    const queryEmbedding = await getEmbedding(query);

    let bestMatch = null;
    let bestScore = -1;

    for (const item of vectorDB) {
      const score = cosineSimilarity(queryEmbedding, item.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item.text;
      }
    }

    res.json({ query, bestMatch, score: bestScore });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

//  Optional: clear/reset vectorDB
router.post("/reset", (req, res) => {
  vectorDB = [];
  res.json({ success: true, message: "vectorDB cleared" });
});

module.exports = router;

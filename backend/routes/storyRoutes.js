// routes/storyRoutes.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// 🧠 Loomy generator (zero-shot)
async function generateStory({ genres, styles, length, blurb, random = false }) {
  const basePrompt = random
    ? "Write a random creative story."
    : `Write a ${length || "short"} story. 
Genres: ${genres?.length ? genres.join(", ") : "any"} 
Styles: ${styles?.length ? styles.join(", ") : "any"} 
Blurb: ${blurb || "Be creative."}`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: basePrompt },
      ],
      max_tokens: 1200,
      temperature: random ? 1.2 : 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Loomy Storyteller",
      },
    }
  );

  if (response.data.usage) {
    console.log("🔢 Token usage:");
    console.log("Prompt tokens:", response.data.usage.prompt_tokens);
    console.log("Completion tokens:", response.data.usage.completion_tokens);
    console.log("Total tokens:", response.data.usage.total_tokens);
  }

  return response.data.choices[0].message.content.trim();
}

// 🎯 Normal story route
router.post("/generate-story", async (req, res) => {
  try {
    const { genres, styles, length, blurb } = req.body;
    const story = await generateStory({ genres, styles, length, blurb });
    res.json({ story });
  } catch (err) {
    console.error("Error generating story:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

// 🎲 Random story route
router.get("/random-story", async (req, res) => {
  try {
    const story = await generateStory({ random: true });
    res.json({ story });
  } catch (err) {
    console.error("Error generating random story:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate random story" });
  }
});

module.exports = router;

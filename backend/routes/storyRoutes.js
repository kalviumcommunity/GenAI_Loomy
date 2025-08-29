// routes/storyRoutes.js
const express = require("express");
const axios = require("axios");
const { buildRandomPrompt, buildNormalPrompt } = require("../utils/promptBuilder");

const router = express.Router();

// 🔎 Word counter
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// 🧠 Loomy generator
async function generateStory({ genres, styles, length, blurb, random = false, retryPrompt = null }) {
  let finalPrompt;

  if (random) {
    finalPrompt = buildRandomPrompt();
  } else {
    finalPrompt = retryPrompt || buildNormalPrompt({ genres, styles, length, blurb });
  }

  // 🔗 Call OpenRouter
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content:
            "You are Loomy, an imaginative and creative storyteller AI that must strictly obey user instructions.",
        },
        { role: "user", content: finalPrompt },
      ],
      max_tokens: 2000, //
      temperature: random ? 1.2 : 0.7,
       top_p: 0.95
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Loomy Storyteller",
      },
    }
  );

  let storyText = response.data.choices[0].message.content.trim();

  let titleMatch = storyText.match(/Title:\s*(.+)/i);
  let storyMatch = storyText.match(/Story:\s*([\s\S]+)/i);

  let title = titleMatch ? titleMatch[1].trim() : "Untitled";
  let story = storyMatch ? storyMatch[1].trim() : storyText;

  console.log("📖 Generated Title:", title);
  console.log("📝 Generated Story (first 300 chars):", story.slice(0, 300) + "...");

  // ✅ If random, just return directly (no word count checks)
  if (random) return { title, story };

  // 🔁 Word count enforcement ONLY for non-random
  const wordCount = countWords(story);
  let min = 150,
    max = 200;
  if (length === "medium") {
    min = 450;
    max = 550;
  } else if (length === "long") {
    min = 750;
    max = 850;
  }

  if (wordCount < min || wordCount > max) {
    console.warn(
      `⚠️ Story length ${wordCount} out of range (${min}-${max}). Retrying...`
    );
    return generateStory({
      genres,
      styles,
      length,
      blurb,
      random,
      retryPrompt: `${finalPrompt}\n\nThe previous attempt was ${wordCount} words. Rewrite strictly within ${min}–${max} words.`,
    });
  }

  return { title, story };
}

//  Normal story route
router.post("/generate-story", async (req, res) => {
  try {
    const { genres, styles, length, blurb } = req.body;
    const { title, story } = await generateStory({ genres, styles, length, blurb });
    res.json({ title, story });
  } catch (err) {
    console.error("❌ Error generating story:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

//  Random story route
router.get("/random-story", async (req, res) => {
  try {
    const { title, story } = await generateStory({ random: true });
    res.json({ title, story });
  } catch (err) {
    console.error("❌ Error generating random story:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate random story" });
  }
});

module.exports = router;

// routes/storyRoutes.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// 🔎 Word counter
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// 🧠 Loomy generator
async function generateStory({ genres, styles, length, blurb, random = false, retryPrompt = null }) {
  const basePrompt = random
    ? `
You are Loomy, a creative storyteller AI.

⚠️ CRITICAL RULES:
1. Word count must strictly follow the requested range.
   - Short → 150-200 words.  
   - Medium → 450-550 words.  
   - Long → 750-850 words.  
   Do not exceed or fall short. If you do, REWRITE until correct.  
2. Story must be smooth, engaging, and end naturally — no filler, no padding.  
3. Output ONLY the story text. No titles, no notes, no commentary.  

Write a completely random story that feels original and polished.  
    `
    : `
You are Loomy, a creative storyteller AI.  
When creating a story:
1. First, think step by step about the plot, characters, and setting accoridng to the prompts given by the user.
2. Then, generate the final story in clear narrative form and also make sure it is within the word limit.


⚠️ CRITICAL RULES (must always be obeyed):
1. Word count must strictly fall inside the requested range.
   - Short → 150-200 words.  
   - Medium → 450-550 words.  
   - Long → 750-850 words.  
   Never go under or over. If you fail, REWRITE until correct.  

2. Fully respect the requested genres and styles.
   - If "horror" → create genuine fear, dread, or unease.  
   - If "adult" → tone must be mature, serious, and unsettling.  
     No childish or fairytale narration.  
   - If "Enid Blyton" style → use clear, simple, direct sentences,  
     but deliver them with a darker, adult tone.  

3. If user specifies "conversation", make 80%+ of the story dialogue between characters,  
   with minimal narration only for setting the scene.  

4. If a blurb is provided, its main ideas and keywords must appear clearly in the story.  

5. The story must flow naturally and end with a proper conclusion — not abruptly, not with filler.  

6. Do not include commentary, titles, headings, or anything outside the story.  

Write a ${length || "short"} story.  
- Genres: ${genres?.length ? genres.join(", ") : "any"}  
- Styles: ${styles?.length ? styles.join(", ") : "any"}  
- Blurb: ${blurb || "No specific blurb, be creative."}  
`;

  const finalPrompt = retryPrompt || basePrompt;

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

  let story = response.data.choices[0].message.content.trim();

  // 🔁 Word count enforcement (retry if needed)
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

  return story;
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

// routes/storyRoutes.js
const express = require("express");
const axios = require("axios");
const { buildRandomPrompt, buildNormalPrompt } = require("../utils/promptBuilder");

const router = express.Router();

// Word counter helper
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// Generate story
async function generateStory({ genres, styles, length, blurb, random = false, retryPrompt = null }) {
  // Choose prompt
  const finalPrompt = random
    ? buildRandomPrompt() // JS function call
    : retryPrompt || buildNormalPrompt({ genres, styles, length, blurb }); // JS function call

  console.log(random ? "Using random prompt" : "Using normal prompt");

  // Call OpenRouter AI
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Loomy, an imaginative storyteller AI." },
        { role: "user", content: finalPrompt }
      ],
      max_tokens: 2000,
      temperature: random ? 1.2 : 0.7,
      top_p: 0.95,
      top_k: 40,
      stopSequences: ["END_OF_RESPONSE", "###"],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    }
  );

  let rawText = response.data.choices[0].message.content.trim();

  // Parse JSON safely
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse JSON:", rawText);
    throw new Error("AI did not return valid JSON");
  }

  const title = parsed.title || "Untitled";
  const story = parsed.story || "";

  if (random) return { title, story };

  // Word count validation
  const wordCount = countWords(story);
  let min = 150, max = 200;
  if (length === "medium") { min = 450; max = 550; }
  else if (length === "long") { min = 750; max = 850; }

  if (wordCount < min || wordCount > max) {
    console.warn(`Story length ${wordCount} out of range (${min}-${max}). Retrying...`);
    return generateStory({
      genres, styles, length, blurb, random,
      retryPrompt: `${finalPrompt}\n\nThe previous attempt was ${wordCount} words. Rewrite strictly within ${min}–${max} words. Only respond in valid JSON with "title" and "story".`
    });
  }

  return { title, story };
}

// Routes

// Normal story
router.post("/generate-story", async (req, res) => {
  try {
    const { genres, styles, length, blurb } = req.body;
    const result = await generateStory({ genres, styles, length, blurb });
    res.json(result);
  } catch (err) {
    console.error("Error generating story:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

// Random story
router.get("/random-story", async (req, res) => {
  try {
    const result = await generateStory({ random: true });
    res.json(result);
  } catch (err) {
    console.error("Error generating random story:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate random story" });
  }
});

// LLM Function Call example
router.post("/function-call-meta", async (req, res) => {
  try {
    const { storyText } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a story analyzer. Extract metadata from stories." },
          { role: "user", content: storyText }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "detectStoryMeta",
              description: "Extract genre, style, and length info from a story",
              parameters: {
                type: "object",
                properties: {
                  genre: { type: "string" },
                  style: { type: "string" },
                  length: { type: "string" }
                },
                required: ["genre", "style", "length"]
              }
            }
          }
        ],
        tool_choice: "auto"
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
      }
    );

    const toolCall = response.data.choices[0]?.message?.tool_calls?.[0];

    if (toolCall) {
      const args = JSON.parse(toolCall.function.arguments);
      console.log("LLM function called:", toolCall.function.name, args);
      return res.json({ toolUsed: toolCall.function.name, meta: args });
    }

    // fallback
    res.json({ meta: { genre: "Unknown", style: "Unknown", length: "Unknown" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Function call failed" });
  }
});

module.exports = router;

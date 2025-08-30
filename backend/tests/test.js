// test.js
const axios = require("axios");

// Small evaluation dataset
const testData = [
  { prompt: { genres: ["Sci-fi"], styles: ["Shashi Tharoor"], length: "short", blurb: "A robot learning emotions" }, min: 150, max: 200 },
  { prompt: { genres: ["Fantasy"], styles: ["Jane Austen"], length: "medium", blurb: "A battle between dragons and humans" }, min: 450, max: 550 },
  { prompt: { genres: ["Mystery"], styles: ["R. K. Narayan"], length: "long", blurb: "A detective investigating a haunted mansion" }, min: 750, max: 850 },
];

// Word counter
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

async function runTests() {
  for (const [i, sample] of testData.entries()) {
    try {
      console.log(`\n🔎 Running Test #${i + 1} (${sample.prompt.genres[0]}, ${sample.prompt.length})`);

      const res = await axios.post("http://localhost:7008/api/generate-story", sample.prompt);
      const { title, story } = res.data;

      const wc = countWords(story);
      const passed = wc >= sample.min && wc <= sample.max;

      console.log(`📖 Title: ${title}`);
      console.log(`📝 Word Count: ${wc}`);
      console.log(passed ? "✅ PASS" : `❌ FAIL (expected ${sample.min}-${sample.max})`);
    } catch (err) {
      console.error(`❌ Test #${i + 1} failed:`, err.response?.data || err.message);
      console.error("Message:", err.message);
      console.error("Response:", err.response?.data);
      console.error("Stack:", err.stack);
        }
  }
}

runTests();

const express = require("express");
const { cosineSimilarity,dotProduct } = require("../utils/similarity");

const router = express.Router();

router.get("/cosine", (req, res) => {
  const vecA = [0.1, 0.2, 0.3];
  const vecB = [0.1, 0.25, 0.35];

  const result = cosineSimilarity(vecA, vecB);
  res.json({ similarity: result });
});
router.get("/dot", (req, res) => {
  const vecA = [0.1, 0.2, 0.3];
  const vecB = [0.1, 0.25, 0.35];

  const result = dotProduct(vecA, vecB);
  res.json({ dotProduct: result });
});

module.exports = router;

// Cosine Similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);

}

function dotProduct(vecA, vecB) {
  return vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
}
function euclideanDistance(vecA, vecB) {
  return Math.sqrt(vecA.reduce((sum, a, i) => sum + (a - vecB[i]) ** 2, 0));
}



module.exports = {
  cosineSimilarity,dotProduct,euclideanDistance
};

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const storyRoutes = require("./routes/storyRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", storyRoutes);

// Start server
const PORT = process.env.PORT || 7008;
app.listen(PORT, () => {
  console.log(`🚀 Loomy backend running on http://localhost:${PORT}`);
});

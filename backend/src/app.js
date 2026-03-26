const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
const movieRoutes = require("./routes/movieRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

app.use("/api/movies", movieRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Prime Video Backend Running ✅");
});

app.use("/api/auth", authRoutes);

module.exports = app;

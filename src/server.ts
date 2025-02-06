import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configurar middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Movie Watchlist API is running! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
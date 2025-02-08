import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import prisma from "./db/index";
import router from "./routes/index.routes";

dotenv.config();

const app = express();

// Configurar middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Movie Watchlist API is running! 🚀");
});

// Routes
app.use("/api", router);
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// 🚀 Endpoint de teste do Prisma
/* app.get("/test-db", async (req, res) => {
    try {
      const movies = await prisma.movie.findMany(); // Ajuste para a tabela correta do seu banco
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Erro ao conectar ao banco de dados" });
    }
  }); */

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});
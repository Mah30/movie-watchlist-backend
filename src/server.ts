import express from "express";
import cors from "cors";
import dotenv from "dotenv";
/* dotenv.config(); */
import prisma from "./db/index";
import authRouter from "./routes/auth.routes";
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
app.use("/auth", authRouter)
app.use("/api", router);
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});


const PORT = process.env.PORT || 5005;

import bcrypt from "bcrypt";

async function ensureAdminExists() {
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        passwordHash,
        isAdmin: true,
      },
    });

    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log("✅ An admin user already exists.");
  }
}

// Run this function when the server starts
ensureAdminExists()
  .catch((error) => {
    console.error("❌ Error ensuring admin user:", error);
  });


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});
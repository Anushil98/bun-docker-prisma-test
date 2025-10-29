import express from "express";
import { prisma } from "./lib/prisma";
import authRouter from "./routes/auth.routes";
import postRouter from "./routes/post.routes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

async function start() {
  try {
    // connect DB first
    await prisma.$connect();
    console.log("✅ DB connected");

    // start HTTP server only after DB is ready
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("🚀 Server running at http://localhost:" + PORT);
    });
  } catch (err) {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();

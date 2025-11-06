import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";  
import swapRoutes from "./routes/swap.routes.js";  


const app = express();
app.use(express.json());
app.use(cors());


app.get("/api/ping", (_req, res) => res.json({ ok: true }));


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", swapRoutes);           

const PORT = process.env.PORT || 5000;

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`🔥 Server at http://localhost:${PORT}`));
})();

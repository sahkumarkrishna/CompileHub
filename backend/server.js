import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// ES module workaround for __dirname
const _dirname = path.resolve()

// Initialize Express app
const app = express();


// Middlewares
app.use(cors({ origin: "https://compilehub-acul.onrender.com",
   credentials: true }));
app.use(express.json());

// Routes
import authRoutes from "./routes/authRoutes.js";
import compileRoutes from "./routes/compileRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/", compileRoutes);

// Serve static frontend (Vite build)
const staticPath = path.join(_dirname, "client", "dist");
app.use(express.static(staticPath));

// Fallback route for SPA (non-API)
 app.get(/^\/(?!api).*/, (_, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});



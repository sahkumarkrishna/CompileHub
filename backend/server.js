import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
dotenv.config({ path: path.join(_dirname, '..', '.env') });

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Connect to MongoDB
connectDB();



// Initialize Express app
const app = express();


// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL,
   credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
import authRoutes from "./routes/authRoutes.js";
import compileRoutes from "./routes/compileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/", compileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// Serve static frontend (Vite build)
const staticPath = path.join(_dirname, "..", "client", "dist");
console.log('Static path:', staticPath);
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



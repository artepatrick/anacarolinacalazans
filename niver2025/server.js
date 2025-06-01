import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Debug: Check if environment variables are loaded
console.log("Environment variables check:", {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
  supabaseUrlLength: process.env.SUPABASE_URL?.length,
  supabaseKeyLength: process.env.SUPABASE_SERVICE_KEY?.length,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(
  cors({
    origin: [
      "https://anacarolinacalazans.com.br",
      "http://localhost:3000",
      "http://localhost:5173", // Vite default port
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "DELETE", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON bodies
app.use(express.json());

// API Routes - These must come BEFORE the static file serving
// Get participants
app.get("/api/participants", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new participant
app.post("/api/participants", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { data, error } = await supabase
      .from("presence_confirmations")
      .insert([{ name, email, phone }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete participant
app.delete("/api/participants/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("presence_confirmations")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get participant count
app.get("/api/participants/count", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("presence_confirmations")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    console.error("Error getting participant count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files AFTER API routes
app.use(express.static(join(__dirname)));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: Check if environment variables are loaded
console.log("Environment variables check:", {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
  supabaseUrlLength: process.env.SUPABASE_URL?.length,
  supabaseKeyLength: process.env.SUPABASE_SERVICE_KEY?.length,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "https://jpkqterigrjwpyrwmxfj.supabase.co",
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
    console.log("Fetching participants from Supabase...");

    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log(`Successfully fetched ${data.length} participants`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Add new participant
app.post("/api/participants", async (req, res) => {
  try {
    const { names, email, phone, status, created_at, updated_at } = req.body;

    // Log the received data for debugging
    console.log("Received participant data:", req.body);

    const { data, error } = await supabase
      .from("presence_confirmations")
      .insert([
        {
          names,
          email,
          phone,
          status: status || "pendente",
          created_at: created_at || new Date().toISOString(),
          updated_at: updated_at || new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
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

// Send notification
app.post("/api/notifications", async (req, res) => {
  try {
    console.log("Received notification request:", req.body);

    const userData = req.body;
    const standard =
      "Estamos enviando uma confirmação de presença para um aniversário. Por favor, envie uma mensagem amigável confirmando a presença e agradecendo o interesse.";

    const requestBody = {
      data: [
        {
          userName: userData.names[0],
          email: userData.email,
          phone: userData.phone,
          eventType: "birthday",
          eventDate: "2025-06-28",
        },
      ],
      generalInstructions: userData.generalInstructions || standard,
    };

    console.log("Sending request to Tolky:", {
      url: process.env.TOLKY_API_BASE_URL,
      hasToken: !!process.env.TOLKY_REASONING_TOKEN,
    });

    const response = await fetch(
      `${process.env.TOLKY_API_BASE_URL}/api/externalAPIs/public/externalNotificationAI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOLKY_REASONING_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tolky API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Tolky API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("Tolky API success response:", result);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      error: "Failed to send notification",
      details: error.message,
    });
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

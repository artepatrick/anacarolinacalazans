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

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname)));

// API endpoint to get participants
app.get("/api/participants", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform data to match the admin panel format
    const participants = data.map((participant) => ({
      id: participant.id,
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      status: "confirmado", // You can add a status column to your table if needed
      registrationDate: participant.created_at,
    }));

    res.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to delete a participant
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

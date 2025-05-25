import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// API endpoint to get all participants
app.get("/api/participants", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to match the frontend expectations
    const participants = data.map((participant) => ({
      id: participant.id,
      name: participant.names[0] || "N/A", // Get the first name from the JSONB array
      email: participant.email,
      status: "pendente", // Default status
      registrationDate: participant.created_at,
      phone: participant.phone,
      count: participant.count,
    }));

    res.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to update participant status
app.patch("/api/participants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("presence_confirmations")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    console.error("Error updating participant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to delete a participant
app.delete("/api/participants/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("presence_confirmations")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

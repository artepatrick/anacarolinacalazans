import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the template
const template = fs.readFileSync(
  path.join(__dirname, "config.template.js"),
  "utf8"
);

// Replace placeholders with environment variables
const config = template
  .replace("{{SUPABASE_URL}}", process.env.SUPABASE_URL || "")
  .replace("{{SUPABASE_ANON_KEY}}", process.env.SUPABASE_ANON_KEY || "")
  .replace("{{SPOTIFY_CLIENT_ID}}", process.env.SPOTIFY_CLIENT_ID || "")
  .replace("{{SPOTIFY_REDIRECT_URI}}", process.env.SPOTIFY_REDIRECT_URI || "");

// Write the config file
fs.writeFileSync(path.join(__dirname, "config.js"), config);

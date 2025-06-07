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

// Copy niver2025 directory to dist
const niver2025Dir = path.join(__dirname, "niver2025");
const distNiver2025Dir = path.join(__dirname, "dist", "niver2025");

if (fs.existsSync(niver2025Dir)) {
  // Create dist/niver2025 directory if it doesn't exist
  if (!fs.existsSync(distNiver2025Dir)) {
    fs.mkdirSync(distNiver2025Dir, { recursive: true });
  }

  // Copy all files from niver2025 to dist/niver2025
  fs.cpSync(niver2025Dir, distNiver2025Dir, { recursive: true });
  console.log("Successfully copied niver2025 directory to dist folder");
}

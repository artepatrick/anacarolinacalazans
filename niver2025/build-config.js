const fs = require("fs");
const path = require("path");

// Read the template
const template = fs.readFileSync(
  path.join(__dirname, "config.template.js"),
  "utf8"
);

// Replace placeholders with environment variables
const config = template
  .replace("{{SUPABASE_URL}}", process.env.SUPABASE_URL)
  .replace("{{SUPABASE_ANON_KEY}}", process.env.SUPABASE_ANON_KEY);

// Write the config file
fs.writeFileSync(path.join(__dirname, "config.js"), config);

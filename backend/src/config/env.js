import dotenv from "dotenv";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootEnvPath = resolve(__dirname, "../../../.env");
const backendEnvPath = resolve(__dirname, "../../.env");

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const parsed = dotenv.parse(readFileSync(path));

  for (const [key, value] of Object.entries(parsed)) {
    if (!value || value === "replace_with_your_saved_password") {
      continue;
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(rootEnvPath);
loadEnvFile(backendEnvPath);

export const config = {
  port: process.env.PORT || 5000,
  cognodbUri: process.env.COGNODB_URI,
  cognodbUser: process.env.COGNODB_USER,
  cognodbPassword: process.env.COGNODB_PASSWORD,
  frontendOrigin: process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || "",
};

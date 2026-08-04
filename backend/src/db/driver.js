import neo4j from "neo4j-driver";
import { config } from "../config/env.js";

if (!config.cognodbUri || !config.cognodbUser || !config.cognodbPassword) {
  throw new Error("Missing COGNODB_URI, COGNODB_USER, or COGNODB_PASSWORD in .env");
}

export const driver = neo4j.driver(
  config.cognodbUri,
  neo4j.auth.basic(config.cognodbUser, config.cognodbPassword)
);

export async function verifyDbConnection() {
  await driver.verifyConnectivity();
}


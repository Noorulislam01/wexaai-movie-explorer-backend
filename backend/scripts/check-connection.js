import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

try {
  await driver.verifyConnectivity();
  console.log("connectivity-ok");
} catch (error) {
  console.error("connectivity-failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await driver.close();
}


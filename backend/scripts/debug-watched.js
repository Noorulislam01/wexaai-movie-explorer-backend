import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

try {
  const session = driver.session();
  const result = await session.run(`
    MATCH (u:User)-[w:WATCHED]->(m:Movie)
    RETURN u.id AS userId, m.id AS movieId, w.rating AS rating
    ORDER BY userId, movieId
  `);
  console.log("rows", result.records.length);
  for (const record of result.records) {
    console.log(record.toObject());
  }
  await session.close();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await driver.close();
}


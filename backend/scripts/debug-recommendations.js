import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

const query = `
MATCH (u:User {id: $userId})-[:WATCHED]->(watched:Movie)<-[:WATCHED]-(other:User)-[:WATCHED]->(rec:Movie)
WHERE u <> other AND NOT (u)-[:WATCHED]->(rec)
RETURN u.id AS userId, watched.id AS sharedMovie, other.id AS otherUser, rec.id AS recommendation
ORDER BY otherUser, recommendation
`;

try {
  const session = driver.session();
  const result = await session.run(query, { userId: "user-anya" });
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


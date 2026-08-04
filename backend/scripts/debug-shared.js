import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

try {
  const session = driver.session();
  const result = await session.run(
    `
    MATCH (u:User {id: $userId})-[:WATCHED]->(m:Movie)<-[:WATCHED]-(other:User)
    RETURN u.id AS userId, m.id AS sharedMovie, other.id AS otherUser
    ORDER BY otherUser, sharedMovie
    `,
    { userId: "user-anya" }
  );
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


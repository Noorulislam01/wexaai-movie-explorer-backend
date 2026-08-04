import { driver } from "../db/driver.js";

function normalizeValue(value) {
  if (value && typeof value.toNumber === "function") {
    return value.toNumber();
  }

  return value;
}

export async function getMovies() {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (m:Movie)
      OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
      RETURN m.id AS id, m.title AS title, m.year AS year, m.rating AS rating, collect(g.name) AS genres
      ORDER BY m.rating DESC, m.year DESC
      `
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      year: normalizeValue(record.get("year")),
      rating: normalizeValue(record.get("rating")),
      genres: record.get("genres").filter(Boolean),
    }));
  } finally {
    await session.close();
  }
}

export async function getMovieById(movieId) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (m:Movie {id: $movieId})
      OPTIONAL MATCH (m)<-[:ACTED_IN]-(a:Actor)
      OPTIONAL MATCH (m)-[:DIRECTED_BY]->(d:Director)
      OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
      RETURN
        m.id AS id,
        m.title AS title,
        m.year AS year,
        m.rating AS rating,
        m.synopsis AS synopsis,
        collect(DISTINCT a { .id, .name }) AS actors,
        head(collect(DISTINCT d { .id, .name })) AS director,
        collect(DISTINCT g { .id, .name }) AS genres
      `,
      { movieId }
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      id: record.get("id"),
      title: record.get("title"),
      year: normalizeValue(record.get("year")),
      rating: normalizeValue(record.get("rating")),
      synopsis: record.get("synopsis"),
      actors: record
        .get("actors")
        .filter(Boolean)
        .map((actor) => ({ id: actor.id, name: actor.name })),
      director: record.get("director")
        ? { id: record.get("director").id, name: record.get("director").name }
        : null,
      genres: record
        .get("genres")
        .filter(Boolean)
        .map((genre) => ({ id: genre.id, name: genre.name })),
    };
  } finally {
    await session.close();
  }
}

export async function getRecommendationsForUser(userId) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:WATCHED]->(seen:Movie)
      WITH u, collect(DISTINCT seen.id) AS watchedIds
      MATCH (u)-[:WATCHED]->(:Movie)<-[:WATCHED]-(other:User)-[:WATCHED]->(rec:Movie)
      WHERE other.id <> $userId AND NOT rec.id IN watchedIds
      OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
      WITH rec, count(DISTINCT other) AS support, collect(DISTINCT g.name) AS genres
      RETURN rec.id AS id, rec.title AS title, rec.year AS year, rec.rating AS rating, support, genres
      ORDER BY support DESC, rec.rating DESC, rec.year DESC
      `,
      { userId }
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      year: normalizeValue(record.get("year")),
      rating: normalizeValue(record.get("rating")),
      support: normalizeValue(record.get("support")),
      genres: record.get("genres").filter(Boolean),
    }));
  } finally {
    await session.close();
  }
}

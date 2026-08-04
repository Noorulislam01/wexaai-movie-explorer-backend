import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

const genres = [
  { id: "genre-sci-fi", name: "Sci-Fi" },
  { id: "genre-drama", name: "Drama" },
  { id: "genre-thriller", name: "Thriller" },
  { id: "genre-action", name: "Action" },
  { id: "genre-comedy", name: "Comedy" },
  { id: "genre-adventure", name: "Adventure" },
];

const directors = [
  { id: "dir-nolan", name: "Christopher Nolan" },
  { id: "dir-villeneuve", name: "Denis Villeneuve" },
  { id: "dir-wachowski", name: "Lana Wachowski" },
  { id: "dir-spielberg", name: "Steven Spielberg" },
  { id: "dir-philips", name: "Todd Phillips" },
  { id: "dir-bong", name: "Bong Joon-ho" },
];

const actors = [
  { id: "actor-dicaprio", name: "Leonardo DiCaprio" },
  { id: "actor-hardy", name: "Tom Hardy" },
  { id: "actor-pascal", name: "Pedro Pascal" },
  { id: "actor-bateman", name: "Jason Bateman" },
  { id: "actor-page", name: "Elliot Page" },
  { id: "actor-mcconaughey", name: "Matthew McConaughey" },
  { id: "actor-fisher", name: "Carrie Fisher" },
  { id: "actor-hathaway", name: "Anne Hathaway" },
  { id: "actor-choi", name: "Choi Woo-shik" },
  { id: "actor-brody", name: "Adrien Brody" },
];

const movies = [
  {
    id: "movie-inception",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    synopsis: "A thief who steals corporate secrets through dream-sharing technology.",
    genreIds: ["genre-sci-fi", "genre-thriller", "genre-action"],
    directorId: "dir-nolan",
    actorIds: ["actor-dicaprio", "actor-hardy", "actor-page"],
  },
  {
    id: "movie-interstellar",
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    synopsis: "A team travels through a wormhole in search of a new home for humanity.",
    genreIds: ["genre-sci-fi", "genre-drama", "genre-adventure"],
    directorId: "dir-nolan",
    actorIds: ["actor-mcconaughey", "actor-hathaway"],
  },
  {
    id: "movie-dune",
    title: "Dune",
    year: 2021,
    rating: 8.0,
    synopsis: "A noble family must protect the galaxy's most valuable resource on a desert planet.",
    genreIds: ["genre-sci-fi", "genre-adventure", "genre-drama"],
    directorId: "dir-villeneuve",
    actorIds: ["actor-pascal", "actor-hathaway"],
  },
  {
    id: "movie-the-matrix",
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    synopsis: "A hacker discovers the reality around him is a simulated world.",
    genreIds: ["genre-sci-fi", "genre-action", "genre-thriller"],
    directorId: "dir-wachowski",
    actorIds: ["actor-hardy"],
  },
  {
    id: "movie-jurassic-park",
    title: "Jurassic Park",
    year: 1993,
    rating: 8.2,
    synopsis: "A theme park with cloned dinosaurs suffers a catastrophic security failure.",
    genreIds: ["genre-adventure", "genre-thriller", "genre-action"],
    directorId: "dir-spielberg",
    actorIds: ["actor-pascal"],
  },
  {
    id: "movie-the-wolf-of-wall-street",
    title: "The Wolf of Wall Street",
    year: 2013,
    rating: 8.2,
    synopsis: "A stockbroker's rise and fall in the world of excess and fraud.",
    genreIds: ["genre-drama", "genre-comedy"],
    directorId: "dir-philips",
    actorIds: ["actor-dicaprio"],
  },
  {
    id: "movie-parasite",
    title: "Parasite",
    year: 2019,
    rating: 8.5,
    synopsis: "A poor family schemes to become employed by a wealthy household.",
    genreIds: ["genre-drama", "genre-thriller"],
    directorId: "dir-bong",
    actorIds: ["actor-choi", "actor-brody"],
  },
  {
    id: "movie-the-dark-knight",
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    synopsis: "Batman faces the Joker in a battle that pushes Gotham to the edge.",
    genreIds: ["genre-action", "genre-thriller", "genre-drama"],
    directorId: "dir-nolan",
    actorIds: ["actor-hardy"],
  },
];

const users = [
  { id: "user-anya", name: "Anya", favoriteGenres: ["genre-sci-fi", "genre-thriller"] },
  { id: "user-ben", name: "Ben", favoriteGenres: ["genre-action", "genre-adventure"] },
  { id: "user-cora", name: "Cora", favoriteGenres: ["genre-drama", "genre-comedy"] },
  { id: "user-dan", name: "Dan", favoriteGenres: ["genre-sci-fi", "genre-drama"] },
  { id: "user-ella", name: "Ella", favoriteGenres: ["genre-thriller", "genre-action"] },
  { id: "user-faiz", name: "Faiz", favoriteGenres: ["genre-adventure", "genre-sci-fi"] },
];

const watched = [
  { userId: "user-anya", movieId: "movie-inception", rating: 5 },
  { userId: "user-anya", movieId: "movie-dune", rating: 4 },
  { userId: "user-anya", movieId: "movie-the-matrix", rating: 5 },
  { userId: "user-ben", movieId: "movie-jurassic-park", rating: 5 },
  { userId: "user-ben", movieId: "movie-the-dark-knight", rating: 4 },
  { userId: "user-ben", movieId: "movie-dune", rating: 4 },
  { userId: "user-cora", movieId: "movie-the-wolf-of-wall-street", rating: 5 },
  { userId: "user-cora", movieId: "movie-parasite", rating: 4 },
  { userId: "user-cora", movieId: "movie-interstellar", rating: 4 },
  { userId: "user-dan", movieId: "movie-interstellar", rating: 5 },
  { userId: "user-dan", movieId: "movie-inception", rating: 4 },
  { userId: "user-dan", movieId: "movie-parasite", rating: 4 },
  { userId: "user-ella", movieId: "movie-the-dark-knight", rating: 5 },
  { userId: "user-ella", movieId: "movie-inception", rating: 4 },
  { userId: "user-ella", movieId: "movie-jurassic-park", rating: 4 },
  { userId: "user-faiz", movieId: "movie-interstellar", rating: 5 },
  { userId: "user-faiz", movieId: "movie-dune", rating: 5 },
  { userId: "user-faiz", movieId: "movie-the-matrix", rating: 4 },
];

function listToMap(items) {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

const genreMap = listToMap(genres);
const directorMap = listToMap(directors);
const actorMap = listToMap(actors);
const movieMap = listToMap(movies);

async function main() {
  const session = driver.session();

  try {
    await session.executeWrite((tx) =>
      tx.run(
        `
        CREATE CONSTRAINT movie_id IF NOT EXISTS
        FOR (m:Movie) REQUIRE m.id IS UNIQUE
        `
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        CREATE CONSTRAINT user_id IF NOT EXISTS
        FOR (u:User) REQUIRE u.id IS UNIQUE
        `
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        CREATE CONSTRAINT actor_id IF NOT EXISTS
        FOR (a:Actor) REQUIRE a.id IS UNIQUE
        `
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        CREATE CONSTRAINT director_id IF NOT EXISTS
        FOR (d:Director) REQUIRE d.id IS UNIQUE
        `
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        CREATE CONSTRAINT genre_id IF NOT EXISTS
        FOR (g:Genre) REQUIRE g.id IS UNIQUE
        `
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $genres AS genre
        MERGE (g:Genre {id: genre.id})
        SET g.name = genre.name
        `,
        { genres }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $directors AS director
        MERGE (d:Director {id: director.id})
        SET d.name = director.name
        `,
        { directors }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $actors AS actor
        MERGE (a:Actor {id: actor.id})
        SET a.name = actor.name
        `,
        { actors }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $movies AS movie
        MERGE (m:Movie {id: movie.id})
        SET m.title = movie.title,
            m.year = movie.year,
            m.rating = movie.rating,
            m.synopsis = movie.synopsis
        `,
        { movies }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $users AS user
        MERGE (u:User {id: user.id})
        SET u.name = user.name
        `,
        { users }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $movies AS movie
        MATCH (m:Movie {id: movie.id})
        MATCH (d:Director {id: movie.directorId})
        MERGE (m)-[:DIRECTED_BY]->(d)
        WITH movie, m
        UNWIND movie.genreIds AS genreId
        MATCH (g:Genre {id: genreId})
        MERGE (m)-[:BELONGS_TO]->(g)
        WITH movie, m
        UNWIND movie.actorIds AS actorId
        MATCH (a:Actor {id: actorId})
        MERGE (a)-[:ACTED_IN]->(m)
        `,
        { movies }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $users AS user
        MATCH (u:User {id: user.id})
        WITH u, user
        UNWIND user.favoriteGenres AS genreId
        MATCH (g:Genre {id: genreId})
        MERGE (u)-[:LIKES]->(g)
        `,
        { users }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $watched AS entry
        MATCH (u:User {id: entry.userId})
        MATCH (m:Movie {id: entry.movieId})
        MERGE (u)-[w:WATCHED]->(m)
        SET w.rating = entry.rating
        `,
        { watched }
      )
    );

    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $users AS user
        MATCH (u:User {id: user.id})
        MATCH (other:User)
        WHERE other.id <> u.id
        MATCH (u)-[:WATCHED]->(m:Movie)<-[:WATCHED]-(other)
        WITH u, other, count(m) AS shared
        WHERE shared >= 1
        MERGE (u)-[s:SIMILAR_TO]->(other)
        SET s.sharedWatched = shared
        `,
        { users }
      )
    );

    const counts = {
      genres: genres.length,
      directors: directors.length,
      actors: actors.length,
      movies: movies.length,
      users: users.length,
      watched: watched.length,
    };

    console.log("Seed completed:", counts);
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await driver.close();
  process.exitCode = 1;
});

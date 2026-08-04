import React from "react";
import { useEffect, useMemo, useState } from "react";
import { fetchMovie, fetchMovies, fetchRecommendations } from "./lib/api";
import MovieCard from "./components/MovieCard";
import MovieGraph from "./components/MovieGraph";
import StatePanel from "./components/StatePanel";

const USERS = [
  { id: "user-anya", name: "Anya" },
  { id: "user-ben", name: "Ben" },
  { id: "user-cora", name: "Cora" },
  { id: "user-dan", name: "Dan" },
  { id: "user-ella", name: "Ella" },
  { id: "user-faiz", name: "Faiz" },
];

export default function App() {
  const [moviesState, setMoviesState] = useState({
    status: "idle",
    data: [],
    error: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("movie-inception");
  const [selectedUserId, setSelectedUserId] = useState(USERS[0].id);
  const [movieDetailState, setMovieDetailState] = useState({
    status: "idle",
    data: null,
    error: null,
  });
  const [recommendationsState, setRecommendationsState] = useState({
    status: "idle",
    data: [],
    error: null,
  });

  const selectedMovie = useMemo(
    () => moviesState.data.find((movie) => movie.id === selectedMovieId) || null,
    [moviesState.data, selectedMovieId]
  );

  const selectedUser = useMemo(
    () => USERS.find((user) => user.id === selectedUserId) || USERS[0],
    [selectedUserId]
  );

  const filteredMovies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return moviesState.data;
    }

    return moviesState.data.filter((movie) => {
      const titleMatches = movie.title.toLowerCase().includes(query);
      const genreMatches = movie.genres.some((genre) => genre.toLowerCase().includes(query));

      return titleMatches || genreMatches;
    });
  }, [moviesState.data, searchTerm]);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setMoviesState({ status: "loading", data: [], error: null });

      try {
        const response = await fetchMovies();
        if (!ignore) {
          setMoviesState({
            status: "success",
            data: response.data,
            error: null,
          });
          setSelectedMovieId(response.data[0]?.id || "");
        }
      } catch (error) {
        if (!ignore) {
          setMoviesState({
            status: "error",
            data: [],
            error: error.message,
          });
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedMovieId) return;

    let ignore = false;

    async function loadMovieDetail() {
      setMovieDetailState({ status: "loading", data: null, error: null });

      try {
        const response = await fetchMovie(selectedMovieId);
        if (!ignore) {
          setMovieDetailState({
            status: "success",
            data: response.data,
            error: null,
          });
        }
      } catch (error) {
        if (!ignore) {
          setMovieDetailState({
            status: "error",
            data: null,
            error: error.message,
          });
        }
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [selectedMovieId]);

  useEffect(() => {
    let ignore = false;

    async function loadRecommendations() {
      setRecommendationsState({
        status: "loading",
        data: [],
        error: null,
      });

      try {
        const response = await fetchRecommendations(selectedUserId);
        if (!ignore) {
          setRecommendationsState({
            status: "success",
            data: response.data,
            error: null,
          });
        }
      } catch (error) {
        if (!ignore) {
          setRecommendationsState({
            status: "error",
            data: [],
            error: error.message,
          });
        }
      }
    }

    loadRecommendations();

    return () => {
      ignore = true;
    };
  }, [selectedUserId]);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">CognoDB Movie Explorer</p>
          <h1>Discover movies through connected people, genres, and taste.</h1>
          <p className="hero-copy">
            A graph-powered recommendation demo built for the WexaAI take-home.
          </p>
        </div>
        <div className="hero-card">
          <span className="hero-card__label">Active viewer</span>
          <label className="user-switcher" htmlFor="user-selector">
            <span className="user-switcher__label">Switch viewer</span>
            <div className="user-switcher__control">
              <select
                id="user-selector"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
              >
                {USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <span className="user-switcher__caret" aria-hidden="true" />
            </div>
          </label>
          <strong>{selectedUser.name}</strong>
          <span className="hero-card__meta">User ID: {selectedUser.id}</span>
        </div>
      </header>

      <main className="dashboard">
        <section className="panel panel--list">
          <div className="panel__header">
            <h2>Movies</h2>
            <span>
              {moviesState.status === "success"
                ? `${filteredMovies.length} of ${moviesState.data.length} titles`
                : ""}
            </span>
          </div>

          {moviesState.status === "success" && (
            <label className="search-bar" htmlFor="movie-search">
              <span>Search by title or genre</span>
              <input
                id="movie-search"
                type="search"
                placeholder="Try Inception or Sci-Fi"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          )}

          {moviesState.status === "loading" && (
            <StatePanel
              title="Loading movies"
              description="Pulling the graph data from CognoDB..."
            />
          )}

          {moviesState.status === "error" && (
            <StatePanel
              title="Could not load movies"
              description={moviesState.error || "Something went wrong."}
            />
          )}

          {moviesState.status === "success" && (
            <div className="movie-grid">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    active={movie.id === selectedMovieId}
                    onClick={() => setSelectedMovieId(movie.id)}
                  />
                ))
              ) : (
                <div className="empty-filter">
                  <h3>No matching movies</h3>
                  <p>Try a different title or genre keyword.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="panel panel--detail">
          <div className="panel__header">
            <h2>Selected Movie</h2>
          </div>

          {movieDetailState.status === "loading" && (
            <StatePanel
              title="Loading details"
              description="Fetching the selected movie from CognoDB..."
            />
          )}

          {movieDetailState.status === "error" && (
            <StatePanel
              title="Could not load details"
              description={movieDetailState.error || "Something went wrong."}
            />
          )}

          {movieDetailState.status === "success" && movieDetailState.data && (
            <div className="detail-card">
              <div className="detail-card__top">
                <div>
                  <p className="detail-card__meta">
                    {movieDetailState.data.year} | {movieDetailState.data.rating.toFixed(1)}
                  </p>
                  <h3>{movieDetailState.data.title}</h3>
                </div>
                <span className="detail-card__pill">
                  {movieDetailState.data.director?.name || "Unknown Director"}
                </span>
              </div>

              <p className="detail-card__synopsis">{movieDetailState.data.synopsis}</p>

              <div className="detail-section">
                <h4>Genres</h4>
                <div className="tag-row">
                  {movieDetailState.data.genres.map((genre) => (
                    <span key={genre.id} className="tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Actors</h4>
                <div className="tag-row">
                  {movieDetailState.data.actors.map((actor) => (
                    <span key={actor.id} className="tag tag--soft">
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {movieDetailState.status === "success" && movieDetailState.data && (
            <div className="graph-panel">
              <MovieGraph movie={movieDetailState.data} />
            </div>
          )}
        </section>

        <section className="panel panel--recommendations">
          <div className="panel__header">
            <h2>Recommendations for {selectedUser.name}</h2>
          </div>

          {recommendationsState.status === "loading" && (
            <StatePanel
              title="Finding recommendations"
              description="Looking for connected movies in the graph..."
            />
          )}

          {recommendationsState.status === "error" && (
            <StatePanel
              title="Could not load recommendations"
              description={recommendationsState.error || "Something went wrong."}
            />
          )}

          {recommendationsState.status === "success" &&
            recommendationsState.data.length === 0 && (
              <StatePanel
                title="No recommendations yet"
                description="Try seeding more overlap between users if you want stronger suggestions."
              />
            )}

          {recommendationsState.status === "success" &&
            recommendationsState.data.length > 0 && (
              <div className="recommendation-list">
                {recommendationsState.data.map((movie) => (
                  <article key={movie.id} className="recommendation-item">
                    <div>
                      <h3>{movie.title}</h3>
                      <p>
                        {movie.year} | {movie.rating.toFixed(1)} | support {movie.support}
                      </p>
                    </div>
                    <div className="tag-row">
                      {movie.genres.map((genre) => (
                        <span key={genre} className="tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>

      <footer className="footer-note">
        {selectedMovie ? `Currently viewing ${selectedMovie.title}` : "Select a movie to see details"}
      </footer>
    </div>
  );
}


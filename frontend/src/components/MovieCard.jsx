import React from "react";

export default function MovieCard({ movie, onClick, active = false }) {
  return (
    <button
      type="button"
      className={`movie-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="movie-card__top">
        <span className="movie-card__year">{movie.year}</span>
        <span className="movie-card__rating">{movie.rating.toFixed(1)}</span>
      </div>
      <h3>{movie.title}</h3>
      <div className="movie-card__genres">
        {movie.genres.map((genre) => (
          <span key={genre}>{genre}</span>
        ))}
      </div>
    </button>
  );
}

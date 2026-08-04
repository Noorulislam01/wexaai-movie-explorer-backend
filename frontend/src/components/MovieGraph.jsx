import React from "react";

function buildNode(label, kind, x, y, key) {
  return { label, kind, x, y, key };
}

export default function MovieGraph({ movie }) {
  if (!movie) {
    return (
      <div className="graph-empty">
        <h4>Graph view</h4>
        <p>Select a movie to see its connected nodes.</p>
      </div>
    );
  }

  const width = 1000;
  const height = 560;
  const centerX = 500;
  const centerY = 290;

  const genreSpacing = movie.genres.length > 1 ? 180 / (movie.genres.length - 1) : 0;
  const actorSpacing = movie.actors.length > 1 ? 180 / (movie.actors.length - 1) : 0;

  const genreNodes = movie.genres.map((genre, index) =>
    buildNode(
      genre.name,
      "genre",
      170,
      190 + index * genreSpacing,
      genre.id
    )
  );

  const actorNodes = movie.actors.map((actor, index) =>
    buildNode(
      actor.name,
      "actor",
      830,
      190 + index * actorSpacing,
      actor.id
    )
  );

  const directorNode = movie.director
    ? buildNode(movie.director.name, "director", centerX, 90, movie.director.id)
    : null;

  const movieNode = buildNode(movie.title, "movie", centerX, centerY, movie.id);
  const allNodes = [directorNode, ...genreNodes, ...actorNodes].filter(Boolean);

  return (
    <div className="graph-shell">
      <div className="graph-shell__header">
        <div>
          <h4>Graph view</h4>
          <p>
            {movie.title} connected to its director, genres, and cast.
          </p>
        </div>
        <div className="graph-shell__legend">
          <span><i className="legend-dot legend-dot--movie" /> Movie</span>
          <span><i className="legend-dot legend-dot--director" /> Director</span>
          <span><i className="legend-dot legend-dot--genre" /> Genre</span>
          <span><i className="legend-dot legend-dot--actor" /> Actor</span>
        </div>
      </div>

      <svg
        className="movie-graph"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Graph of ${movie.title} relationships`}
      >
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ce5c6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#6ca8ff" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {directorNode && (
          <line
            x1={directorNode.x}
            y1={directorNode.y + 26}
            x2={movieNode.x}
            y2={movieNode.y - 34}
            className="graph-edge graph-edge--director"
          />
        )}

        {genreNodes.map((node) => (
          <line
            key={`edge-${node.key}`}
            x1={node.x + 118}
            y1={node.y}
            x2={movieNode.x - 118}
            y2={movieNode.y}
            className="graph-edge graph-edge--genre"
          />
        ))}

        {actorNodes.map((node) => (
          <line
            key={`edge-${node.key}`}
            x1={node.x - 118}
            y1={node.y}
            x2={movieNode.x + 118}
            y2={movieNode.y}
            className="graph-edge graph-edge--actor"
          />
        ))}

        {allNodes.map((node) => (
          <g key={node.key} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              x={-118}
              y={-22}
              width={236}
              height={44}
              rx={22}
              className={`graph-node graph-node--${node.kind}`}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="graph-node__label"
            >
              {node.label}
            </text>
          </g>
        ))}

        <g transform={`translate(${movieNode.x}, ${movieNode.y})`}>
          <circle r="86" className="graph-center" />
          <circle r="78" className="graph-center__inner" />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="graph-center__title"
          >
            {movie.title}
          </text>
          <text
            y="34"
            textAnchor="middle"
            dominantBaseline="middle"
            className="graph-center__meta"
          >
            {movie.year} | {movie.rating.toFixed(1)}
          </text>
        </g>
      </svg>
    </div>
  );
}


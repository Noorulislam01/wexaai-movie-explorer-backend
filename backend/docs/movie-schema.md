# Movie Explorer Graph Schema

## Nodes

- `User`
  - `id`
  - `name`
- `Movie`
  - `id`
  - `title`
  - `year`
  - `rating`
  - `synopsis`
- `Actor`
  - `id`
  - `name`
- `Director`
  - `id`
  - `name`
- `Genre`
  - `id`
  - `name`

## Relationships

- `(User)-[:WATCHED {rating}]->(Movie)`
- `(User)-[:LIKES]->(Genre)`
- `(Actor)-[:ACTED_IN]->(Movie)`
- `(Movie)-[:DIRECTED_BY]->(Director)`
- `(Movie)-[:BELONGS_TO]->(Genre)`
- `(User)-[:SIMILAR_TO {sharedWatched}]->(User)`

## Why this works well

This model makes recommendations and connected-content queries natural:

- find users who watched the same movies
- traverse from a user to similar users to movies they liked
- surface actors, directors, and genres around a movie in one hop or more


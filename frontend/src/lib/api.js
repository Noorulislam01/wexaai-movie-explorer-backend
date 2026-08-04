const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json();
}

export async function fetchMovies() {
  return request("/api/movies");
}

export async function fetchMovie(movieId) {
  return request(`/api/movies/${movieId}`);
}

export async function fetchRecommendations(userId) {
  return request(`/api/movies/recommendations/${userId}`);
}


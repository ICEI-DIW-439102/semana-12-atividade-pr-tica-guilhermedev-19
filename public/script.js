// ===== Configuração =====
const API_KEY = "0827c8cceb647aa0e34145acf9c0e6a5";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";
const FALLBACK_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='342' height='513'><rect width='100%' height='100%' fill='%23211b1c'/><text x='50%' y='50%' fill='%23a89a8d' font-family='sans-serif' font-size='16' text-anchor='middle'>Sem imagem</text></svg>";

// ===== Elementos =====
const movieListEl = document.getElementById("movie-list");
const messageEl = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

// ===== Requisição à API =====
async function fetchMovies(query = "") {
  const endpoint = query
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

// ===== Criação de um card =====
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const posterWrap = document.createElement("div");
  posterWrap.classList.add("movie-card__poster-wrap");

  const poster = document.createElement("img");
  poster.classList.add("movie-card__poster");
  poster.src = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : FALLBACK_POSTER;
  poster.alt = `Pôster de ${movie.title}`;
  poster.loading = "lazy";
  posterWrap.appendChild(poster);

  const rating = document.createElement("span");
  rating.classList.add("movie-card__rating");
  rating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  posterWrap.appendChild(rating);

  const body = document.createElement("div");
  body.classList.add("movie-card__body");

  const title = document.createElement("h3");
  title.classList.add("movie-card__title");
  title.textContent = movie.title;

  const year = document.createElement("p");
  year.classList.add("movie-card__year");
  year.textContent = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Ano desconhecido";

  const overview = document.createElement("p");
  overview.classList.add("movie-card__overview");
  overview.textContent = movie.overview
    ? movie.overview
    : "Sinopse não disponível.";

  body.appendChild(title);
  body.appendChild(year);
  body.appendChild(overview);

  card.appendChild(posterWrap);
  card.appendChild(body);

  return card;
}

// ===== Renderização da lista =====
function renderMovies(movies) {
  movieListEl.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado. Tente outro título.");
    return;
  }

  showMessage("");
  const fragment = document.createDocumentFragment();
  movies.forEach((movie) => {
    fragment.appendChild(createMovieCard(movie));
  });
  movieListEl.appendChild(fragment);
}

// ===== Mensagens de estado =====
function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("is-error", isError);
}

// ===== Busca =====
async function runSearch() {
  const query = searchInput.value.trim();

  showMessage(query ? `Buscando por "${query}"…` : "Carregando filmes populares…");
  movieListEl.innerHTML = "";

  try {
    const movies = await fetchMovies(query);
    renderMovies(movies);
  } catch (error) {
    console.error(error);
    showMessage("Ocorreu um erro ao buscar os filmes. Tente novamente.", true);
  }
}

// ===== Inicialização =====
async function init() {
  showMessage("Carregando filmes populares…");
  try {
    const movies = await fetchMovies();
    renderMovies(movies);
  } catch (error) {
    console.error(error);
    showMessage("Não foi possível carregar os filmes. Verifique sua conexão ou a API key.", true);
  }
}

btnSearch.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runSearch();
  }
});

document.addEventListener("DOMContentLoaded", init);

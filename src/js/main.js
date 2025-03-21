"use strict";

const apiKey = "cde6c1c5";
const searchInput = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");
const moviesContainer = document.getElementById("home-page-movies");
const movieDetails = document.getElementById("movieDetailsDiv");

// Eventhanterare som lyssnar på klick på sökknappen.
searchButton.addEventListener("click", () => {
    const searchTitle = searchInput.value;
    if (searchTitle) {
        searchMovies(searchTitle);
    }
});

// Eventhanterare som lyssnar på keypress på enter-tangenten.
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchTitle = searchInput.value;
        if (searchTitle) {
            searchMovies(searchTitle);
        }
    }
});

// Funktion som hämtar filmer med async/await och try/catch
async function searchMovies(title) {
    const url = `http://www.omdbapi.com/?s=${title}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            moviesContainer.innerHTML = "<p>Inga filmer hittades.</p>";
        }
    } catch (error) {
        console.error("Fel vid hämtning av filmer:", error);
        moviesContainer.innerHTML = "<p>Ett fel uppstod. Försök igen senare.</p>";
    }
};

// Funktion för att visa filmer på sidan
function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        movieElement.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" 
            alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        movieElement.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });

        moviesContainer.appendChild(movieElement);
    })
};

async function getMovieDetails(imdbID) {
    const url2 = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    try {
        const response = await fetch(url2);
        const movie = await response.json();

        if (movie.Response === "True") {
            displayMovieDetails(movie);

            document.getElementById("movieDetailsDiv").scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
        } else {
            movieDetails.innerHTML = `<p> Inga detaljer finns att hämta här... Testa en annan film! </p>`
        }
    } catch (error) {
        console.error("Fel!", error);
    }
    }

function displayMovieDetails(movie) {
    movieDetails.innerHTML = `
        <h2>${movie.Title}</h2>
        <h3>BETYG FRÅN IMDB: ${movie.imdbRating}</h3>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        <h4>LÄNGD: ${movie.Runtime}</h4>
        <h4>GENRE: ${movie.Genre}</h4>
        <h4>REGISSÖR: ${movie.Director}</h4>
        <h4>SLÄPPTES: ${movie.Year}</h4>

        <h5> THE PLOT: </h5>
        <p>${movie.Plot}</p>
        <p><i class="fa-solid fa-trophy" style="color: rgb(233, 190, 0);"></i> ${movie.Awards}</p>
    `
};


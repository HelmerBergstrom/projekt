"use strict";

const apiKey = "cde6c1c5";
const searchInput = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");
const moviesContainer = document.getElementById("moviesContainer");
const movieDetails = document.getElementById("movieDetailsDiv");
const moviePageText = document.getElementById("movie-page-info");

// Eventhanterare som lyssnar på klick på sökknappen.
searchButton.addEventListener("click", () => {
    const searchTitle = searchInput.value;
    if (searchTitle) {
        searchMovies(searchTitle);
        moviePageText.style.display = "block";
    }
});

// Eventhanterare som lyssnar på keypress på enter-tangenten.
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchTitle = searchInput.value;
        if (searchTitle) {
            searchMovies(searchTitle);
            moviePageText.style.display = "block";
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
            directorInfo(movie);

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
};

function displayMovieDetails(movie) {
    movieDetails.innerHTML = `
        <h1>${movie.Title}</h1>
        <p>BETYG FRÅN IMDB: ${movie.imdbRating}</p>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        <p><strong>LÄNGD:</strong> ${movie.Runtime}</p>
        <p><strong>GENRE:</strong> ${movie.Genre}</p>
        <p><strong>REGISSÖR:</strong> ${movie.Director}</p>
        <p><strong>SLÄPPTES:</strong> ${movie.Year}</p>

        <p id="awardsText"><i class="fa-solid fa-trophy" style="color: rgb(233, 190, 0);"></i> ${movie.Awards}</p>


        <h2 style="color: rgb(233, 190, 0);"> THE PLOT: </h2>
        <p id="plotText">${movie.Plot}</p>
    `
};

// Wikipedia API som ska koppla film/serie till regissör och skriva ut information om regissören.

async function directorInfo(searchInput) {

    if(searchInput.Director === "N/A") {
        document.getElementById("director-info").innerHTML = `
        <p> Ingen info om regissören hittades! </p>
        `;
        return;
    }

    const formattedSearch = searchInput.Director.replace(/ /g, "_");
    const wikiUrl = `https://sv.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${formattedSearch}&format=json&origin=*`;

    try {
        const response = await fetch(wikiUrl);
        const data = await response.json();
        const page = Object.values(data.query.pages)[0];
    
        if(page.extract) {
            document.getElementById("director-info").innerHTML = `
            <h3 style="color: rgb(233, 190, 0);">Snabb fakta om regissören ${page.title}</h3>
            <p>${page.extract} </p>
        `
        } else {
            document.getElementById("director-info").innerHTML = `
            <p> Ingen information om regissören hittades! </p>
            `
        }
    } catch(error) {
        console.error("FEL: ", error);
    }
};

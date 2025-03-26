"use strict";

/**
 * Lagrar API-nyckel för OMDB API.
 * @const {string} 
 */
const apiKey = "cde6c1c5";

/**
 * Hämtar ID för användarens input-fält.
 * @const {HTMLElement | null}
 */
const searchInput = document.getElementById("search-field");
/**
 * Hämtar ID för sökknappen.
 * @const {HTMLElement | null}
 */
const searchButton = document.getElementById("search-button");
/**
 * Hämtar ID för sektionen där filmer ska visas.
 * @const {HTMLElement | null}
 */
const moviesContainer = document.getElementById("moviesContainer");
/**
 * Hämtar ID för där detaljer om filmer ska visas.
 * @const {HTMLElement | null}
 */
const movieDetails = document.getElementById("movieDetailsDiv");
/**
 * Hämtar ID för en textremsa.
 * @const {HTMLElement | null}
 */
const moviePageText = document.getElementById("movie-page-info");

/**
 * Sökknappen får händelselyssnare på klick.
 * Anropar funktionen searchMovies() med användarens input från sökfältet.
 * Visar text "moviePageText".
 * 
 * @event searchButton#click
 */
searchButton.addEventListener("click", () => {
    const searchTitle = searchInput.value;
    if (searchTitle) {
        searchMovies(searchTitle);
        moviePageText.style.display = "block";
    }
});

/**
 * Input-fältet får händelselyssnare som lyssnar på knapptryck på enter-knappen.
 * Anropar funktionen searchMovies() med användarens input från sökfältet.
 * Visar text "moviePageText".
 * 
 * @event searchInput#keypress
 */
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchTitle = searchInput.value;
        if (searchTitle) {
            searchMovies(searchTitle);
            moviePageText.style.display = "block";
        }
    }
});

/**
 * Hämtar filmdata beroende på användarens sökning.
 * 
 * @async
 * @function searchMovies
 * @returns {Promise<void>} Uppdaterar endast DOM med filmer/serier som hämtats.
 * @throws {Error} Skriver ut felmeddelande vid fel.
 */
async function searchMovies(title) {
    /** @const {string} url - URL för att hämta data, där "title" är användarens sökning. */
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

/**
 * Visar posters, titlar på filmer/serier och år då de släpptes.
 * 
 * @function displayMovies
 * @param {Array} movies - array med filmer/serier från tidigare funktion.
 */
function displayMovies(movies) {

    // Rensar innehållet i moviesContainer.
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        /**
         * Skapar HTML-element 
         * @const {HTMLElement}
         */
        const movieElement = document.createElement("div");

        // Lägger till klass för elementet.
        movieElement.classList.add("movie");

        // Skriver ut för visning på sidan.
        movieElement.innerHTML = `
        <picture>
            <source srcset="${movie.Poster.replace('.jpg', '.avif')}" type="image/avif">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        </picture>
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        /**
         * Händelselyssnare för varje film som visas. Lyssnar på klick.
         * Anropar funktionen getMovieDetails() och skickar med imdb ID:t från filmen.
         * @event movieElement#click
         */
        movieElement.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });

        // Lägger till filmer i div-elementet.
        moviesContainer.appendChild(movieElement);
    })
};

/** 
 * Funktion för att hämta detaljer om film efter användarens klick.
 * 
 * @async
 * @function getMovieDetails
 * @param {string} imdbID - imdbID för specifikta filmen/serien.
 * @returns {Promise<void>} Uppdaterar endast DOM med detaljerna.
 * @throws {Error} Skriver ut felmeddelande om det inte funkar.
 */
async function getMovieDetails(imdbID) {

    /** @const {string} url2 - URL för att hämta detaljer med imdbID:t för filmen/serien. */
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

/**
 * Visar detaljer för filmen/serien. Skriver ut med innerHTML.
 * 
 * @function displayMovieDetails
 * @param {Array} movie - array med detaljer.
 */
function displayMovieDetails(movie) {
    movieDetails.innerHTML = `
        <h1>${movie.Title}</h1>
        <p>BETYG FRÅN IMDB: ${movie.imdbRating}</p>

        <picture>
            <source srcset="${movie.Poster.replace('.jpg', '.avif')}" type="image/avif">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        </picture>
        <p><strong>LÄNGD:</strong> ${movie.Runtime}</p>
        <p><strong>GENRE:</strong> ${movie.Genre}</p>
        <p><strong>REGISSÖR:</strong> ${movie.Director}</p>
        <p><strong>SLÄPPTES:</strong> ${movie.Year}</p>

        <p id="awardsText"><i class="fa-solid fa-trophy" style="color: rgb(233, 190, 0);"></i> ${movie.Awards}</p>


        <h2 style="color: rgb(233, 190, 0);"> THE PLOT </h2>
        <p id="plotText">${movie.Plot}</p>
    `
};

/**
 * Visar information om regissören om det finns. Finns regissörens
 * namn i searchInput.Director görs anrop till wikipedia-api. Därefter
 * skrivs snabba fakta ut om regissören. Finns ingen data om regissören i OMDB API:et
 * står det "N/A", därför kontrolleras detta i funktionen.
 * 
 * @async
 * @function directorInfo
 * @param {Object} searchInput - Objekt som innehar detaljer inkl. regissörens namn.
 * @returns {Promise<void>} Uppdaterar DOM med regissörens info om det finns.
 * @throws {Error} Skriver ut felmeddelande om info saknas om regissören.
 */
async function directorInfo(searchInput) {
    // Är regissörens "namn": N/A = skriv ut felmeddelande och avsluta funktionen.
    if(searchInput.Director === "N/A") {
        document.getElementById("director-info").innerHTML = `
        <p> Ingen info om regissören hittades! </p>
        `;
        return;
    }

    // Ändrar mellanslag i sökningen till "_" för att wikipedias API kör med "_".
    const formattedSearch = searchInput.Director.replace(/ /g, "_");
    
    // Skickar nya namnet med "_" till url.
    const wikiUrl = `https://sv.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${formattedSearch}&format=json&origin=*`;

    try {
        const response = await fetch(wikiUrl);
        const data = await response.json();
        const page = Object.values(data.query.pages)[0];
    
        // Finns regissör, skriv ut information.
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
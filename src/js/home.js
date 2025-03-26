"use strict";

/**
 * Lagrar API-nyckel för OMDB API.
 * @const {string} 
 */
const apiKey = "cde6c1c5";

/**
 * Lagrar HTML-elementet där posters ska läggas på startsidan.
 * @const {HTMLElement | null}
 */
const homePage = document.getElementById("home-page-posters");

/**
 * Väntar tills HTML har laddats och kör funktioner därefter.
 * Anropar funktionen getData() om användaren är på startsidan.
 * 
 * @event window#DOMContentLoaded
 */
window.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname === "/" || window.location.pathname.includes("index.html")) {
        getData();
    }
});


/**
 * Hämtar Star Wars data som ska visas på startsidan.
 * 
 * @async
 * @function getData
 * @returns {Promise<void>} Uppdaterar DOM med info om filmerna.
 * @throws {Error} Skriver ut felmeddelande om API musslyckas.
 */

async function getData() {
    /** @const {string} posterUrl1 - URL för att hämta Star Wars-filmer. */
    const posterUrl1 = `http://www.omdbapi.com/?s=Star_Wars&apikey=${apiKey}`;

    try {
        const response = await fetch(posterUrl1)
        const poster = await response.json();

        if(poster.Response === "True") {
            displayHomePage(poster.Search);
        } else {
            homePage.innerHTML = "<p> Vi ber om ursäkt, här ska det egentligen finnas posters för filmer! </p>";
        }

    } catch(error) {
        console.error("Fel: ", error);
    }
};

/**
 * Visar posters på startsidan.
 * 
 * @function displayHomePage
 * @param {Array} poster - array med "objects" från API:et
 */
function displayHomePage(poster) {

    // Rensar innehållet i homePage.
    homePage.innerHTML = "";

    poster.forEach(post => {

        /** Lagrar bilden. @const {string} */
        const posterPicture = post.Poster !== "N/A" ? post.Poster : "placeholder.jpg";

        /**
         * Skapar nytt div-element för varje bild.
         * @const {HTMLElement}
         */
        const posterElement = document.createElement("div");

        // Lägger till klassen posterPic till div-elementet för att kunna stila.
        posterElement.classList.add("posterPic");

        // Skriver ut bild samt 999kr i pris för varje poster. Även länk till order.html-sidan på varje bild.
        posterElement.innerHTML = `
        <a href="order.html">
        <img src="${posterPicture}" alt="${post.Title}"></a>
        <br>
        <br>
        <br>
        <br>
        <p> 999kr/st </p>
        `

        // Lägger till postern i DIV-elementet.
        homePage.appendChild(posterElement)
    });
};
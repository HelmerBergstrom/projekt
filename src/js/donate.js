"use strict";

/**
 * Lagrar API-nyckel för OMDB API:et
 * @const {string}
 */
const apiKey = "cde6c1c5";

/**
 * Hämtar ID där posters ska läggas.
 * @const {HTMLElement | null}
 */
const divEl = document.getElementById("orderPosters");

/**
 * Hämtar ID för beställningssektionen
 * @const {HTMLElement | null}
 */
const orderSection = document.getElementById("order-section");

/**
 * Hämtar ID för beställningsformuläret
 * @const {HTMLElement | null}
 */
const orderForm = document.getElementById("order-form");

/**
 * Hämtar ID för en textsträng
 * @const {HTMLElement | null}
 */
const clickPoster = document.getElementById("clickPoster");

/**
 * Väntar tills sidan har laddats och kör funktionen getData().
 * 
 * @event window#DOMContentLoaded
 */
window.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.includes("/order.html")) {
        getData();
    }
});

/**
 * Funkion för att hämta Star Wars filmers data.
 * 
 * @async
 * @function getData
 * @returns {Promise<void>} Uppdaterar DOM med array av information av filmerna.
 * @throws {Error} Felmeddelande ifall hämtningen misslyckas.
 */
async function getData () {
    /** @const {string} url - URL för att hämta STar Wars-data.  */
    const url = `http://www.omdbapi.com/?s=Star_Wars&apikey=${apiKey}`

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(data.Response === "True") {
            displayPosters(data.Search);
        } else {
            divEl.innerHTML = "<p> Just nu har vi inga posters i lager! </p>"
        }
    } catch(error) {
        console.error("Fel: ", error)
    }
}

/**
 * Visar posters för Star Wars-filmer.
 * Picture-tagg för att konvertera bilder till avif om möjligt. JPG som fallback.
 * 
 * @function displayPosters
 * @param {Array} posters - array med "objects" med detaljer om filmerna.
 */

function displayPosters(posters) {
    
    // Rensar innehållet.
    divEl.innerHTML = "";

    posters.forEach(post => {
        
        /** Lagrar bilder @const {string} */
        const picture = post.Poster !== "N/A" ? post.Poster : "placeholder.jpg";

        /**
         * Skapar nytt element för varje bild.
         * @const {HTMLElement}
         */
        const posterEl = document.createElement("div");

        // Lägger till klass
        posterEl.classList.add("order-poster-class");

        // Skriver ut bilder med innerHTML.
        posterEl.innerHTML = `
        <picture>
            <source srcset="${picture.replace('.jpg', '.avif')}" type="image/avif">
            <img src="${picture}" alt="${post.Title}">
        </picture>
    <br>
    <br>
        <p> 999kr/st </p>
        <br>
        `

        /**
         * Händelselyssnare vid klick på poster.
         * Anropar funktionen displayOrderForm() och skickar med poster.
         * Beställningsformuläret får "display: block;".
         * Texten inom ID "clickPoster" får "display: none;".
         * 
         * @event posterEl#click
         */
        posterEl.addEventListener("click", () => {
            displayOrderForm(post);
            orderForm.style.display = "block";
            clickPoster.style.display = "none"
        });
    
        // Lägger till postern till det skapade elementet.
        divEl.appendChild(posterEl)
    });
};

/** 
 * Funktion för att visa beställningsformuläret med postern som klickades på.
 * 
 * @function displayOrderForm
 * @param {Object} post - Skickar med info om filmen som klickades på.
 */
function displayOrderForm(post) {

    /** 
     * Skapar nytt DIV-element 
     * @const {HTMLElement} 
    */
    const orderSectionEl = document.createElement("div");
    // Ger nya elementet en klass.
    orderSectionEl.classList.add("orderPosterPic");

    // Skriver ut posterns titel och bild.
    orderSectionEl.innerHTML = `
        <p> ${post.Title} </p>
        <picture>
            <source srcset="${post.Poster.replace('.jpg', '.avif')}" type="image/avif">
            <img src="${post.Poster !== "N/A" ? post.Poster : "placeholder.jpg"}" alt="${post.Title}"> 
        </picture>
        `
    // När funktionen körs ska användaren skrollas ned till ID "scrollIntoView".
    // setTimeout för att invänta att beställningsformuläret laddas innan skrollandet.
    // Sätter timeout till 500ms, alltså 0.5 sekunder.
    setTimeout(() => {
    document.getElementById("scrollIntoView").scrollIntoView({
        behavior: "smooth",
        block: "end"
    })
    }, 500);

    // Skriver ut till sidan.
    orderSection.appendChild(orderSectionEl)
};
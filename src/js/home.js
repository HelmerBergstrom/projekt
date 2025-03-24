"use strict";

const apiKey = "cde6c1c5";

const homePage = document.getElementById("home-page-posters");

window.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname === "/" || window.location.pathname.includes("index.html")) {
        getData();
    }
});

async function getData() {
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

function displayHomePage(poster) {

    homePage.innerHTML = "";

    poster.forEach(post => {

        const posterPicture = post.Poster !== "N/A" ? post.Poster : "placeholder.jpg";

        const posterElement = document.createElement("div");
        posterElement.classList.add("posterPic");
        posterElement.innerHTML = `
        <img src="${posterPicture}" alt="${post.Title}">
        `

        homePage.appendChild(posterElement)
    });
};
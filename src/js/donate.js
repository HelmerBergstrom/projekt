"use strict";

const apiKey = "cde6c1c5";

const divEl = document.getElementById("orderPosters");

window.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.includes("/order.html")) {
        getData();
    }
});

async function getData () {
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

function displayPosters(posters) {
    
    divEl.innerHTML = "";

    posters.forEach(post => {
        
        const picture = post.Poster !== "N/A" ? post.Poster : "placeholder.jpg";

        const posterEl = document.createElement("div");
        posterEl.classList.add("order-poster-class");
        posterEl.innerHTML = `
        <img src="${picture}" alt="${post.Title}">
        <br>
        <br>
        <p> 999kr/st </p>
        <br>
        
        `

        divEl.appendChild(posterEl)
    });
}
"use strict";

const apiKey = "cde6c1c5";

const divEl = document.getElementById("orderPosters");
const orderSection = document.getElementById("order-section");
const orderForm = document.getElementById("order-form");
const clickPoster = document.getElementById("clickPoster");

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

        posterEl.addEventListener("click", () => {
            displayOrderForm(post);
            orderForm.style.display = "block";
            clickPoster.style.display = "none"
        });
    
        divEl.appendChild(posterEl)
    });
};

function displayOrderForm(post) {

    const orderSectionEl = document.createElement("div");
    orderSectionEl.classList.add("orderPosterPic");

    orderSectionEl.innerHTML = `
        <p> ${post.Title} </p>
        <img src="${post.Poster !== "N/A" ? post.Poster : "placeholder.jpg"}" alt="${post.Title}"> 
        `

    document.getElementById("scrollIntoView").scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

    orderSection.appendChild(orderSectionEl)
};
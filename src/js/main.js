"use strict";

const url1 = `http://www.omdbapi.com/?s=${searchTitel}&apikey=cde6c1c5`;
const url2 = `http://www.omdbapi.com/?s=${searchID}&apikey=cde6c1c5`;

fetch(url1)
    .then(response => response.json())
    .then(data => 
        { console.log(data);
        })
        .catch(error => console.error("Fel:", error));

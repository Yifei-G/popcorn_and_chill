import {Constants} from "./constant.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
const imgBasePath = "https://image.tmdb.org/t/p/w342/";
const logoBasePath = "https://image.tmdb.org/t/p/w45/";
window.onload = function WindowLoad(event){
    const params = new URLSearchParams(window.location.search),
    movieID = params.get("movieID");
    console.log(movieID);

    async function getMovieDetail(){
        const request = new Request();
        request.setBaseURL(baseURL);
        try{
            const movieData = await request.loadMovies(`movie/${movieID}?${apiKey}&language=en-US`);
            const providerData = await request.loadMovies(`movie/${movieID}/watch/providers?${apiKey}`);
            console.log(providerData);
            debugger;
            displayMovie(movieData);
            if(Object.keys(providerData.results).length > 0 && providerData.results.constructor === Object){
                displayPlatforms(providerData.results);
            }
            
        }   catch(error){
            console.log(error);
        }
    }
    getMovieDetail();
}

function displayMovie(movie){
    const posterCtn = document.querySelector(".detail-poster-container");
    const infoCtn = document.querySelector(".info-container");
    const poster = `<img src=${imgBasePath}${movie.poster_path}>`;
    let movieType = "";
    movie.genres.forEach(genre =>{
        if(movie.genres.length > 1){
            movieType += genre.name + " | ";
        }
        else if(movie.genres.length == 1){
            movieType += genre.name;
        }
        
    })

    const primaryInfo = `<h2>Title: ${movie.original_title}</h2>
    <h3>Type: ${movieType}</h3>
    <h4 class="mb-3">Score: ${movie.vote_average}/10</h4>
    <p>Plot: ${movie.overview}</p>
    `
    posterCtn.insertAdjacentHTML("beforeend", poster);

    infoCtn.insertAdjacentHTML("beforeend", primaryInfo);
}

function displayPlatforms(providers){
    debugger;
    const platformContainer = `<div class="platform-container d-flex-block flex-wrap border border-danger" ></div>`;
    const infoCtn = document.querySelector(".info-container");
    infoCtn.insertAdjacentHTML("beforeend", platformContainer);
    const platformTitle = `<h2>Watch Now:</h2>`;
    const platformCtn = document.querySelector(".platform-container");
    platformCtn.insertAdjacentHTML("beforeend", platformTitle);
    if(providers.US.rent){
        const rentTitle = `<h3 class="mx-2">Buy:</h3>`;
        platformCtn.insertAdjacentHTML("beforeend", rentTitle);
        for(const rentPlatform of providers.US.rent){
            debugger;
            const platformLogo = `<img class="mx-2" src="${logoBasePath}${rentPlatform.logo_path}">`
            platformCtn.insertAdjacentHTML("beforeend", platformLogo);
        }

    }
    if(providers.US.flatrate){
        const streamTitle = `<h3 class="mx-2 my-3">Stream:</h3>`;
        platformCtn.insertAdjacentHTML("beforeend", streamTitle);
        for(const steamPlatform of providers.US.flatrate){
            const platformLogo = `<img class="mx-2" src="${logoBasePath}${steamPlatform.logo_path}">`
            platformCtn.insertAdjacentHTML("beforeend", platformLogo);
        }
    }
}
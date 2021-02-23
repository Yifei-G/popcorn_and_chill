import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs'
import {Constants} from "./constant.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
const imgBasePath = "https://image.tmdb.org/t/p/w342/";
const logoBasePath = "https://image.tmdb.org/t/p/w45/";
const imgBackgrounPath = "https://image.tmdb.org/t/p/original/";
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
    const primaryCtn = document.querySelector(".primary-container");
    debugger;

    const colorThief = new ColorThief();
    const img = new Image();
    img.addEventListener('load', ()=>{
        debugger;
        const dominantColor = colorThief.getColor(img);
        console.log(dominantColor);
        const [r,g,b] = dominantColor;
        const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        primaryCtn.style.background = `linear-gradient(rgba(${r}, ${g}, ${b}, 0.7), rgba(255, 255, 255, 0.5)),url("${imgBackgrounPath}${movie.backdrop_path}")`;
        primaryCtn.style.backgroundSize = `cover`;
        primaryCtn.style.backgroundPosition = `45% 15%`;
        (hsp>127.5)? primaryCtn.style.color="black" : primaryCtn.style.color="white";
        // if (hsp>127.5){
        //     console.log("light");

        // }
        // else{
        //     console.log('dark');
        // }


        
    });

    const backgroundURL = `${imgBackgrounPath}${movie.backdrop_path}`;
    img.crossOrigin = 'Anonymous';
    img.src = backgroundURL;

    


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

    let movieTitle = `<h2>Title: ${movie.title}</h2>`;

    if(movie.title != movie.original_title){
        movieTitle = `<h2>Title: ${movie.title} (${movie.original_title})</h2>`;
    }
    const primaryInfo = `${movieTitle}
    <h3>Type: ${movieType}</h3>
    <h4 class="mb-3">Score: ${movie.vote_average}/10</h4>
    <p>Plot: ${movie.overview}</p>
    `
    posterCtn.insertAdjacentHTML("beforeend", poster);

    infoCtn.insertAdjacentHTML("beforeend", primaryInfo);
}

function displayPlatforms(providers){
    const platformContainer = `<div class="platform-container d-flex-block flex-wrap border border-danger" ></div>`;
    const infoCtn = document.querySelector(".info-container");
    infoCtn.insertAdjacentHTML("beforeend", platformContainer);
    const platformTitle = `<h2>Watch Now:</h2>`;
    const platformCtn = document.querySelector(".platform-container");
    platformCtn.insertAdjacentHTML("beforeend", platformTitle);
    if(providers.US){
        if(providers.US.rent){
            const rentTitle = `<h3 class="mx-2">Buy:</h3>`;
            platformCtn.insertAdjacentHTML("beforeend", rentTitle);
            for(const rentPlatform of providers.US.rent){
                const platformLogo = `<img class="mx-2 rounded rounded-3" src="${logoBasePath}${rentPlatform.logo_path}">`
                platformCtn.insertAdjacentHTML("beforeend", platformLogo);
            }
    
        }
        if(providers.US.flatrate){
            const streamTitle = `<h3 class="mx-2 my-3">Stream:</h3>`;
            platformCtn.insertAdjacentHTML("beforeend", streamTitle);
            for(const steamPlatform of providers.US.flatrate){
                const platformLogo = `<img class="mx-2 rounded rounded-3" src="${logoBasePath}${steamPlatform.logo_path}">`
                platformCtn.insertAdjacentHTML("beforeend", platformLogo);
            }
        }
    }
    else{
        const noPlatforms = `<h3>Sorry the movie is not available on any online platforms in the U.S</h3>`;
        platformCtn.insertAdjacentHTML("beforeend", noPlatforms);
    }

}
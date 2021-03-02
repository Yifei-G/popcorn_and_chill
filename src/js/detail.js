import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs'
import {Constants} from "./constant.js";
import {displayMovies} from "./utils.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
const imgBasePath = "https://image.tmdb.org/t/p/w342/";
const logoBasePath = "https://image.tmdb.org/t/p/w45/";
const mediaImgPath = "https://image.tmdb.org/t/p/w500/";
const imgBackgrounPath = "https://image.tmdb.org/t/p/original/";
window.onload = function WindowLoad(event){
    const params = new URLSearchParams(window.location.search),
    movieID = params.get("movieID");

    async function getMovieDetail(){
        const request = new Request();
        request.setBaseURL(baseURL);
        try{
            //getting the movie details
            const movieData = await request.loadData(`movie/${movieID}?${apiKey}&language=en-US`);
            //getting the movie provider
            const providerData = await request.loadData(`movie/${movieID}/watch/providers?${apiKey}`);
            //getting the movie trailer
            const videoData = await request.loadData(`movie/${movieID}/videos?${apiKey}&language=en-US`);
            //getting the posters
            const imgData = await request.loadData(`movie/${movieID}/images?${apiKey}&include_image_language=en,null`);

            debugger;

            //getting the all the similar movies
            const similarMovies = await request.loadData(`movie/${movieID}/similar?${apiKey}&language=en-US&page=1`)
            console.log(providerData);
            console.log(videoData);
            console.log(similarMovies);
            displayMovie(movieData);
            
            //we need at least 1 provider, empty results will not be displayed
            if(Object.keys(providerData.results).length > 0 && providerData.results.constructor === Object){
                displayPlatforms(providerData.results);
            }

            if(videoData.results.length > 0){
                displayVideos(videoData.results);
            }

            if(imgData.posters.length > 0){
                displayPhotos(imgData.posters);
            }

            if(similarMovies.results.length > 0){
                const similarMoviesCtn = document.querySelector(".similar-movies-container");
                similarMoviesCtn.classList.remove("d-none");
                displayMovies(similarMovies.results, "similar-movies");
            }

            
        }   catch(error){
            console.log(error);
        }
    }
    getMovieDetail();
}

function displayMovie(movie){
    const primaryCtn = document.querySelector(".primary-container");

    if(movie.backdrop_path){
        const colorThief = new ColorThief();
        const img = new Image();
        img.addEventListener('load', ()=>{
            const dominantColor = colorThief.getColor(img);
            console.log(dominantColor);
            const [r,g,b] = dominantColor;
            //we calculate if the backgound image is dark or light
            const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
            //let's generate the background image with a blur effect
            primaryCtn.style.background = `linear-gradient(rgba(${r}, ${g}, ${b}, 0.7), rgba(255, 255, 255, 0.35)),url("${imgBackgrounPath}${movie.backdrop_path}")`;
            primaryCtn.style.backgroundSize = `cover`;
            primaryCtn.style.backgroundPosition = `45% 15%`;
            // the text color should be contrast than the background image's primary color
            (hsp>127.5)? primaryCtn.style.color="black" : primaryCtn.style.color="snow"
        });
        const backgroundURL = `${imgBackgrounPath}${movie.backdrop_path}`;
        img.crossOrigin = 'Anonymous';
        img.src = backgroundURL;
    }



    const posterCtn = document.querySelector(".detail-poster-container");
    const infoCtn = document.querySelector(".info-container");
    const poster = `<img class="" alt="movie poster cover" src=${imgBasePath}${movie.poster_path}>`;
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
    ${movie.runtime != 0 ? `<h4>Duration: ${movie.runtime} Minutes</h4>` : ``}
    <h4>Status:${movie.status}</h4>
    ${movie.release_date ? `<h4>Release Date: ${movie.release_date}</h4>`: `<h4>Release Date: Coming Soon</h4>`}
    <h4>Score: ${movie.status === "Released" ? `${movie.vote_average}/10` : `NR` } </h4>
    <h3>Type: ${movieType}</h3>
    <p>Plot: ${movie.overview}</p>
    `

    const loader = document.querySelector("#data-loader");
    loader.classList.remove('d-inline-flex');
    loader.classList.add('d-none');
    posterCtn.insertAdjacentHTML("beforeend", poster);

    infoCtn.insertAdjacentHTML("beforeend", primaryInfo);
}

function displayPlatforms(providers){
    const platformContainer = `<div class="platform-container" ></div>`;
    const infoCtn = document.querySelector(".info-container");
    infoCtn.insertAdjacentHTML("beforeend", platformContainer);
    const platformTitle = `<h2>Watch Now:</h2>`;
    const platformCtn = document.querySelector(".platform-container");
     platformCtn.insertAdjacentHTML("beforeend", platformTitle);

    //providers are based on countries, we are only focused in US
    if(providers.US){
        if(providers.US.rent){
            const rentTitle = `<h3 class="mx-2">Buy:</h3>`;
            platformCtn.insertAdjacentHTML("beforeend", rentTitle);
            for(const rentPlatform of providers.US.rent){
                const platformLogo = `<img class="mx-2 rounded rounded-3" src="${logoBasePath}${rentPlatform.logo_path}" alt="platform logo">`
                platformCtn.insertAdjacentHTML("beforeend", platformLogo);
            }
    
        }
        if(providers.US.flatrate){
            const streamTitle = `<h3 class="mx-2 my-3">Stream:</h3>`;
            platformCtn.insertAdjacentHTML("beforeend", streamTitle);
            for(const steamPlatform of providers.US.flatrate){
                const platformLogo = `<img class="mx-2 rounded rounded-3" src="${logoBasePath}${steamPlatform.logo_path}" alt="platform logo">`
               platformCtn.insertAdjacentHTML("beforeend", platformLogo);
            }
        }
    }
    else{
        const noPlatforms = `<h3>Sorry the movie is not available on any online platforms in the U.S</h3>`;
        platformCtn.insertAdjacentHTML("beforeend", noPlatforms);
    } 

}


function displayVideos(videos){
    let youtubePath = "https://www.youtube.com/embed/";
    let vimeoPath = "https://player.vimeo.com/video/";
    let fullPath = "";
    let videoindicator = "";
    let carouselItem = "";
    const mediaContainer = document.querySelector("#media-container");
    const videoIndicators = document.querySelector("#video-indicators");
    const videoContainer = document.querySelector("#video-container");
    for (let i = 0;(i < videos.length && i < 5); i++){
        (videos[i].site === "YouTube") ? fullPath = youtubePath + videos[i].key : fullPath = vimeoPath + videos[i].key
        videoindicator = `<li data-target="#video-carousel" data-slide-to="${i}" class="${i == 0 ? `active` : ``} carousel-indicators-color "></li>`;
        carouselItem = `<div class="carousel-item ${i == 0 ? `active` : ``}">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${fullPath}" allowfullscreen></iframe>
            </div>
          </div>`
          videoIndicators.insertAdjacentHTML("beforeend", videoindicator);
          videoContainer.insertAdjacentHTML("beforeend",carouselItem);
    }

    mediaContainer.classList.remove("d-none");
    mediaContainer.classList.add("d-flex");
}

function displayPhotos(posters){
    let photoIndicator = "";
    let carouselItem = "";
    const mediaContainer = document.querySelector("#media-container");
    const photoIndicators = document.querySelector("#photo-indicators");
    const photoContainer = document.querySelector("#photo-container");
    for(let i = 0; (i<posters.length && i < 5); i++){
        photoIndicator = `<li data-target="#photo-carousel" data-slide-to="${i}" class="${i == 0 ? `active` : ``} carousel-indicators-color "></li>`;
        carouselItem = `<div class="carousel-item ${i == 0 ? `active` : ``}">
        <img src="${mediaImgPath}${posters[i].file_path}" class="d-block m-auto" alt="movie poster">
      </div>`;
      photoIndicators.insertAdjacentHTML("beforeend", photoIndicator);
      photoContainer.insertAdjacentHTML("beforeend", carouselItem);
    }

}
import Request from "./request.js";
const basePath = "https://api.themoviedb.org/3/";
const imgBasePath = "https://image.tmdb.org/t/p/w300/"
const apiKey = "api_key=18ea9ff3cb40f35bd251e90c45e9033f";
let morePage = 11;
let newRequestTimer = 10000;
window.onload = function WindowLoad(event){
    for(let page=1; page<11; page++){
        getMovies(page);
    }
}

window.addEventListener("scroll", ()=>{
    //when user wants to see more movies, let's repeat the request using the scroll event listener
    //we don't want to stress the server, so let's make request every 3 seconds
    setInterval(()=>{
        console.log("10s has been set!!!");
        getMovies(morePage);
        morePage ++;
    },newRequestTimer)
});

async function getMovies(page){
    const request = new Request();
    request.setBaseURL(basePath);
    try{
        const data = await request.loadMovies(`movie/popular?${apiKey}&language=en-US&page=${page}`);
        //console.log(data);

        //all the movies are saved at results
        displayMovies(data.results);
    }   catch(error){
        console.log(error);
    }
}

function displayMovies(movies){
    const parentContainer = document.querySelector("#movies");
    for(const movie of movies){
        debugger;
        const movieContainer = `<div class="movie-container">
        <img class="poster-container" src=${imgBasePath}${movie.poster_path}>
        </div>`
        //console.log(movie);
        parentContainer.insertAdjacentHTML("beforeend", movieContainer);

    }

}
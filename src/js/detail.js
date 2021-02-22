import {Constants} from "./constant.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
const imgBasePath = "https://image.tmdb.org/t/p/w342/";
window.onload = function WindowLoad(event){
    const params = new URLSearchParams(window.location.search),
    movieID = params.get("movieID");
    console.log(movieID);

    async function getMovieDetail(){
        const request = new Request();
        request.setBaseURL(baseURL);
        try{
            const data = await request.loadMovies(`movie/${movieID}?${apiKey}&language=en-US`);
            displayMovie(data);
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
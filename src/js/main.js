import {Constants} from "./constant.js";
import {displayMovies} from "./utils.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
let morePage = 11;
let scrollDownEl = document.querySelector("#scroll-down-anchor");
window.onload = function WindowLoad(event){
    for(let page=1; page<11; page++){
        getMovies(page);
    }
}

scrollDownEl.addEventListener("click", ()=>{
    window.scrollBy({
        top: 450,
        behavior: 'smooth'
      });
      getMovies(morePage);
      morePage ++;
});

async function getMovies(page){
    const request = new Request();
    request.setBaseURL(baseURL);
    try{
        const data = await request.loadData(`movie/popular?${apiKey}&language=en-US&page=${page}`);
        //console.log(data);

        //all the movies are saved at results
        displayMovies(data.results, "movies");
    }   catch(error){
        console.log(error);
    }
}
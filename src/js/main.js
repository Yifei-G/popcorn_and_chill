import {Constants} from "./constant.js";
import {displayMovies} from "./utils.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
let morePage = 11;
let newRequestTimer = 15000;
let scrollDownEl = document.querySelector("#scroll-down-anchor");
window.onload = function WindowLoad(event){
    for(let page=1; page<11; page++){
        getMovies(page);
    }
}

scrollDownEl.addEventListener("click", ()=>{
    console.log("clicked!!");
});
// window.addEventListener("scroll", ()=>{
//     //when user wants to see more movies, let's repeat the request using the scroll event listener
//     //we don't want to stress the server, so let's make request every 15 seconds
//     setInterval(()=>{
//         console.log("15s has been set!!!");
//         getMovies(morePage);
//         morePage ++;
//     },newRequestTimer)
// });

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
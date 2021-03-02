import DOMPurify from '../../node_modules/dompurify/dist/purify.es.js';
import {Constants} from "./constant.js";
import {displayMovies} from "./utils.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
const search = document.querySelector("#search");
const userInput = document.querySelector("#user-input");
let searchModal = document.querySelector("#search-result");
// let scrollDownEl = document.querySelector("#modal-scroll-down-anchor");
let morePage = 1
let pageLimit = 0;
let sanitizedInput = "";
userInput.addEventListener("keyup", ()=>{
    userInput.value ? search.disabled = false : search.disabled = true;
});
search.addEventListener("click",(event)=>{
    //we don't want the page got reloaded after user clicks the button
    event.preventDefault();
    morePage = 1;
    searchModal.innerHTML = "";
    //let's sanitize user's input
    sanitizedInput = DOMPurify.sanitize(userInput.value);
    searchMovies(sanitizedInput);
});

async function searchMovies(name){
    const request = new Request();
    request.setBaseURL(baseURL);
    try{
        const data = await request.loadData(`search/movie?${apiKey}&query=${name}&page=${morePage}`);
        //all the movies are saved at results
        debugger;
        pageLimit = data.total_pages;
        if(data.total_pages > 1){
            morePage++
        }
        if(data.results.length > 0){
            displayMovies(data.results, "search-result");
        }else{
            const noResults = `<h3>Sorry, we didn't find anything</h3>`;
            searchModal.insertAdjacentHTML("beforeend", noResults);
        }
    }   catch(error){
        console.log(error);
    }
}

searchModal.addEventListener("scroll", ()=>{
    if(morePage < pageLimit){
        searchMovies(sanitizedInput);
    }
})


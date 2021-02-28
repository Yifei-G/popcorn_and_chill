import DOMPurify from '../../node_modules/dompurify/dist/purify.es.js';
import {Constants} from "./constant.js";
import {displayMovies} from "./utils.js";
import Request from "./request.js";
const baseURL = Constants.basePath;
const apiKey = Constants.apiKey;
const search = document.querySelector("#search");
const userInput = document.querySelector("#user-input");


search.addEventListener("click",(event)=>{
    //we don't want the page got reloaded after user clicks the button
    event.preventDefault();
    let searchModal = document.querySelector("#search-result");
    searchModal.innerHTML = "";
    //let's sanitize user's input
    let cleanInput = DOMPurify.sanitize(userInput.value);
    searchMovies(cleanInput);
});

async function searchMovies(name){
    const request = new Request();
    request.setBaseURL(baseURL);
    try{
        const data = await request.loadData(`search/movie?${apiKey}&query=${name}`);
        //all the movies are saved at results
        displayMovies(data.results, "search-result");
        
    }   catch(error){
        console.log(error);
    }
}


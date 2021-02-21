export default class Request {
    constructor(){
        this.baseURL = "";
    }

    setBaseURL(baseURL){
        this.baseURL = baseURL;
    }
    
    async loadMovies(relativeURL){
        const URL = this.baseURL + relativeURL;
        const response = await fetch(URL);
        return response.json();
    }

}







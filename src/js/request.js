export default class Request {
    constructor(){
        this.baseURL = "";
    }

    setBaseURL(baseURL){
        this.baseURL = baseURL;
    }
    
    async loadData(relativeURL){
        const URL = this.baseURL + relativeURL;
        try{
            const response = await fetch(URL);
            return response.json();
        }catch (error){
            console.log(error);
        }

    }

}







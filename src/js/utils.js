function displayMovies(movies, containerID){
    const coverImgPath = "https://image.tmdb.org/t/p/w300/";
    const targetContainer = document.querySelector(`#${containerID}`);
    for(const movie of movies){
        //each movie is also a clicable link to redirect to the detail page
        //let's generate the movie container div with the img element
        //we don't display movies without a poster
        if(movie.poster_path){
            const params = new URLSearchParams();
            params.append("movieID", movie.id);
            const movieContainer = `<a href="./detail.html?${params.toString()}"><div id="${movie.id}" class="movie-container">
            <img class="poster-container rounded rounded-3" src=${coverImgPath}${movie.poster_path} alt="movie-cover">
            </div></a>`;
            targetContainer.insertAdjacentHTML("beforeend", movieContainer);
    
        }

    }

}

export {displayMovies};
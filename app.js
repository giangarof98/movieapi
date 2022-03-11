const autocompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return ` 
            <img src="${imgSrc}"/>
            <h1>${movie.Title} (${movie.Year})</h1>
        `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTearm){
        const res = await axios.get('http://www.omdbapi.com/', {
            params: { apikey: "13e27bcd", s: searchTearm}
        })
        if(res.data.Error){ return []}
        return res.data.Search;
    }
}

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onSelectMovie(movie, document.querySelector('#left-summary'));
    },
});

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onSelectMovie(movie, document.querySelector('#right-summary'));
    },
});



const onSelectMovie = async (movie, summaryEl) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: { apikey: "13e27bcd", i: movie.imdbID}
    })
    summaryEl.innerHTML = movieTemplate(res.data)
}

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMBD Votes</p>
        </article>
    `
}
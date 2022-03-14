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
        const res = await axios.get('https://www.omdbapi.com/', {
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
        onSelectMovie(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onSelectMovie(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie;
let rightMovie;

const onSelectMovie = async (movie, summaryEl, side) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: { apikey: "13e27bcd", i: movie.imdbID}
    });
    summaryEl.innerHTML = movieTemplate(res.data);

    if(side === 'left'){
        leftMovie = res.data;
    } else{
        rightMovie = res.data;
    }

    if(leftMovie && rightMovie){
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);


        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = (movieDetail) => {
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'')
    )

    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''))
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)){
            return prev;
        } else {
            return prev + value;
        }
    }, 0)
    console.log(awards)

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
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMBD Votes</p>
        </article>
    `
}
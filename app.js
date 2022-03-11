
const fetchData = async(searchTearm) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: { apikey: "13e27bcd", s: searchTearm}
    })
    if(res.data.Error){ return []}
    return res.data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search for a movie</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results')

const onInput = async e => {
    const movies = await fetchData(e.target.value);
    
    dropdown.classList.add('is-active')
    for(let movie of movies){
        const option = document.createElement('a');
        option.classList.add('dropdown-item')
        option.innerHTML = ` 
                <img src="${movie.Poster}"/>
                <h1>${movie.Title}</h1>
        `;
        resultsWrapper.appendChild(option)
    }
}

input.addEventListener('input', debounce(onInput, 500))


const fetchData = async(searchTearm) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: "13e27bcd",
            s: searchTearm,
        }
    })
    return res.data.Search;
}

const input = document.querySelector('input');

const onInput = async e => {
    const movies = await fetchData(e.target.value);
    for(let movie of movies){
        const div = document.createElement('div');

        div.innerHTML = ` 
                <img src="${movie.Poster}"/>
                <h1>${movie.Title}</h1>
        `;
        document.querySelector('#poster').appendChild(div)
    }
}

input.addEventListener('input', debounce(onInput, 500))

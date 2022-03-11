
const fetchData = async(searchTearm) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: "13e27bcd",
            s: searchTearm,
        }
    })
    console.log(res.data);
}

const input = document.querySelector('input');

const onInput = e => {
    fetchData(e.target.value);
}

input.addEventListener('input', debounce(onInput, 500))

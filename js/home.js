const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);
let pokemonTypeColors = {};
const limit = 300;
let allPokemon = [];

fetch('data/pokemonTypes.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch Pokémon types');
        return response.json();
    })
    .then(pokemonTypes => {
        pokemonTypeColors = pokemonTypes.reduce((map, type) => {
            map[type.type] = type.color;
            return map;
        }, {});
        createPokédexUI();
        fetchPokemon();
    });

function createPokédexUI() {
    const header = document.createElement("header");
    header.innerHTML = `
        <span class="header__logo">
            <img src="assets/Pokeball.svg" alt="Poké Ball" class="pokeball-logo">
            Pokédex
        </span>
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search Pokémon name..." class="search-input">
            <button class="search-icon"> <img src="/assets/text_format.svg"> </button>
        </div>
        <div class="sort-container">
            <div class="sort-label">Sort by:</div>
            <div class="sort-options">
                <label><input type="radio" name="sort" value="number" checked> Number</label>
                <label><input type="radio" name="sort" value="name"> Name</label>
            </div>
        </div>
    `;

    const main = document.createElement("main");

    const footer = document.createElement("footer");
    footer.innerHTML = `
        <br>
        <br>
        Created 2025
    `;

    root.appendChild(header);
    root.appendChild(main);
    root.appendChild(footer);
    initializeEventListeners();
}

function initializeEventListeners() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", updateDisplay);

    const sortRadios = document.querySelectorAll('input[name="sort"]');
    sortRadios.forEach(radio => {
        radio.addEventListener("change", updateDisplay);
    });
}

function fetchPokemon() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch Pokémon');
            return response.json();
        })
        .then(data => {
            const pokemonList = document.querySelector("main");
            pokemonList.innerHTML = data.results.map(pokemon => {
                const id = pokemon.url.slice(0, -1).split("/").pop();
                return `
                    <article class="pokemon-card" data-id="${id}">
                        <div class="card-content">
                            <h2 class="pokemon-number"> #${id} </h2>
                            <a href="detail.html?id=${id}">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${pokemon.name}" loading="lazy">
                            </a>
                        </div>
                        <h2 class="pokemon-name">${pokemon.name}</h2>
                    </article>
                `;
            }).join("");

            const typePromises = data.results.map(pokemon => {
                const id = pokemon.url.slice(0, -1).split("/").pop();
                return fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => {
                        const primaryType = pokemonData.types[0].type.name;
                        const card = document.querySelector(`.pokemon-card[data-id="${id}"]`);
                        if (card) {
                            card.style.border = `2px solid ${pokemonTypeColors[primaryType.toLowerCase()] || '#AAA67F'}`;
                        }
                    });
            });

            Promise.all(typePromises);

            allPokemon = data.results.map(pokemon => {
                const id = pokemon.url.slice(0, -1).split("/").pop();
                return { name: pokemon.name, id: parseInt(id), url: pokemon.url };
            });

            updateDisplay();
        });
}

function updateDisplay() {
    const searchInput = document.getElementById("searchInput");
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = document.querySelector('input[name="sort"]:checked').value;
    let filteredPokemon = [...allPokemon];

    if (searchTerm) {
        filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm)
        );
    }

    filteredPokemon.sort((a, b) => {
        if (sortBy === "number") {
            return a.id - b.id;
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    const pokemonList = document.querySelector("main");
    pokemonList.innerHTML = filteredPokemon.map(pokemon => {
        return `
            <article class="pokemon-card" data-id="${pokemon.id}">
                <div class="card-content">
                    <h2 class="pokemon-number"> #${pokemon.id} </h2>
                    <h2 class="pokemon-name">${pokemon.name}</h2>
                    <a href="detail.html?id=${pokemon.id}">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}" loading="lazy">
                    </a>
                </div>
            </article>
        `;
    }).join("");

    filteredPokemon.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
                const primaryType = pokemonData.types[0].type.name;
                const card = document.querySelector(`.pokemon-card[data-id="${pokemon.id}"]`);
                if (card) {
                    card.style.border = `2px solid ${pokemonTypeColors[primaryType.toLowerCase()] || '#AAA67F'}`;
                }
            });
    });
}




































// let sectionElm = document.createElement("section");
// sectionElm.className = "pokelist";


// let divElm = document.createElement("div");
// divElm.id = "root";

// divElm.innerHTML = `
//     <header>
//         <span class="brand">Pokédex</span>
//     </header>
//     <main></main>
//     <footer>Created 2025</footer>
// `;


// fetch("https://pokeapi.co/api/v2/pokemon")
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         let pokemonList = divElm.querySelector("main");
        
//         pokemonList.innerHTML = data.results.map(function(pokemon) {
//             let id = pokemon.url.slice(0, -1).split("/").pop();
            
//             return `
//                 <article>
//                     <h2>${pokemon.name}</h2>
//                     <a href="detail.html?id=${id}">
//                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${pokemon.name}">
//                     </a>
//                 </article>
//             `;
//         }).join("");

//         sectionElm.append(divElm);
//     })
//     .catch(error => console.error('Error fetching Pokémon:', error));


// document.body.append(sectionElm);
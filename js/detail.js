document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    if (pokemonId) {
        fetch('data/pokemonTypes.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch Pokémon types');
                return response.json();
            })
            .then(pokemonTypes => {
                const pokemonTypeColors = pokemonTypes.reduce((map, type) => {
                    map[type.type] = type.color;
                    return map;
                }, {});

                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to fetch Pokémon');
                        return response.json();
                    })
                    .then(data => {
                        const primaryType = data.types[0].type.name;
                        const typeColor = pokemonTypeColors[primaryType.toLowerCase()] || '#ff4444'; // Default to red if type not found

                        const detailContainer = document.createElement('div');
                        detailContainer.className = 'pokemon-detail';
                        detailContainer.style.backgroundColor = typeColor; // Set background color based on Pokémon type

                        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
                            .then(response => {
                                if (!response.ok) throw new Error('Failed to fetch Pokémon species');
                                return response.json();
                            })
                            .then(speciesData => {
                                const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'No description available';

                                detailContainer.innerHTML = `
                                    <div class="detail-header">
                                        <a href="index.html" class="back-btn"><i class="fa-solid fa-arrow-left" style="color: #ffffff;"></i></a>
                                        <h1>${data.name} <span>#${data.id}</span></h1>
                                    </div>
                                    <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png" alt="${data.name}">
                                    <img class="pokeball-logo" src="/assets/Pokeball.svg" alt="Poké Ball">
                                    <article class="wrapper">
                                        <div class="types-section">
                                            ${data.types.map(type => `
                                                <span class="type-badge" style="background-color: ${pokemonTypeColors[type.type.name.toLowerCase()] || '#ff4444'}">
                                                    ${type.type.name}
                                                </span>
                                            `).join('')}
                                        </div>
                                        <div class="detail-sections">
                                            <section class="about-section">
                                                <h2>About</h2>
                                                <div class="about-details">
                                                    <p>Weight: ${data.weight / 10} kg</p>
                                                    <p>Height: ${data.height / 10} m</p>
                                                    <p>Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                                                </div>
                                                <p>${description.replace(/\n/g, ' ')}</p>
                                            </section>
                                            <section class="stats-section">
                                                <h2>Base Stats</h2>
                                                ${data.stats.map(stat => `
                                                    <div class="stat-row">
                                                        <span>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</span>
                                                        <meter value="${stat.base_stat}" max="255" style="background: ${typeColor};"></meter>
                                                    </div>
                                                `).join('')}
                                            </section>
                                        </div>
                                    </article>
                                `;

                                document.body.appendChild(detailContainer);
                            })
                            .catch(error => console.error('Error fetching Pokémon species:', error));
                    })
                    .catch(error => console.error('Error fetching Pokémon details:', error));
            })
            .catch(error => console.error('Error fetching Pokémon types:', error));
    }
});
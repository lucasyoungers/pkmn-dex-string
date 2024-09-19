#!/usr/bin/env node

async function fetchData(url) {
    const res = await fetch(url)
    if (!res.ok) {
        console.error(res.statusText)
        exit(1)
    }
    return res.json()
}

function getNumber(speciesData) {
    return speciesData.pokedex_numbers.find(o => o.pokedex.name === "national").entry_number
}

function getSpecies(speciesData) {
    return speciesData.genera.find(o => o.language.name === "en").genus
}

function getHeight(pokemonData) {
    const inches = pokemonData.height * 3.937008
    const ft = Math.floor(inches / 12)
    const _in = Math.round(inches % 12)
    return { ft, in: _in }
}

function getWeight(pokemonData) {
    const weight = pokemonData.weight * 0.2204623
    return Math.round(weight * 10) / 10
}

async function main() {
    // get pokémon from user
    if (process.argv.length !== 3) {
        console.error("Usage: pkmn-dex-string <pokémon name>")
        exit(1)
    }
    const pokemon = process.argv[2].toLowerCase()

    // get data from api
    const pokemonData = await fetchData("https://pokeapi.co/api/v2/pokemon/" + pokemon)
    const speciesData = await fetchData(pokemonData.species.url)

    // process data
    const number = getNumber(speciesData)
    const species = getSpecies(speciesData)
    const height = getHeight(pokemonData)
    const weight = getWeight(pokemonData)

    // convert data to string format
    const svFormat = `NO. ${String(number).padStart(4, "0")}  ${species}  HT: ${height.ft}'${height.in}"  WT: ${weight} lbs.`
    console.log(svFormat)
}

main()
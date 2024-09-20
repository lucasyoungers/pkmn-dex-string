#!/usr/bin/env node

const parseArgs = require("minimist")

async function fetchData(url) {
    const res = await fetch(url)
    if (!res.ok) {
        console.error(res.statusText)
        process.exit(1)
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

async function getString(pokemon, format) {
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
    return svFormat
}

async function main() {
    // get pokémon from user
    const args = parseArgs(process.argv.slice(2), {
        boolean: [ "batch" ],
        string: [ "delimiter", "format" ],
        alias: {
            "b": "batch",
            "d": "delimiter",
            "f": "format"
        }
    })

    if (args._.length === 0) {
        console.error("Must provide at least 1 Pokémon.")
        process.exit(1)
    }

    if (!args.batch) {
        const pokemon = args._[0]
        console.log(await getString(pokemon, args.format))
    } else {
        const pokemon = args._
        const strings = await Promise.all(pokemon.map(p => getString(p, args.format)))
        console.log(strings.join(args.delimiter || "\n"))
    }
}

main()
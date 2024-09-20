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
    return weight
}

async function getString(pokemon, format="sv") {
    // get data from api
    const pokemonData = await fetchData("https://pokeapi.co/api/v2/pokemon/" + pokemon)
    const speciesData = await fetchData(pokemonData.species.url)

    // process data
    const number = getNumber(speciesData)
    const species = getSpecies(speciesData)
    const height = getHeight(pokemonData)
    const weight = getWeight(pokemonData)

    // convert data to string format
    switch (format) {
        case "base":
        case "gym":
        case "neo":
        case "e":
            format = `%s. Length: %f'%i", Weight: %0w lbs.`
            break
        case "dppt":
        case "hgss":
        case "bw":
        case "xy":
        case "sm":
        case "swsh":
            format = `NO. %3n  %s  HT: %f'%i"  WT: %w lbs.`
            break
        case "sv":
            format = `NO. %4n  %s  HT: %f'%i"  WT: %w lbs.`
            break
        default:
            break
    }

    const output = format
        .replace(/%\d*n/, s => String(number).padStart(Number(s.slice(1, -1)), "0"))
        .replace("%s", species)
        .replace("%f", height.ft)
        .replace("%i", height.in)
        .replace(/%\d*w/, s => {
            const n = Number(s.slice(1, -1) || 1)
            return Math.round(weight * (10**n)) / (10**n)
        })
    return output
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
#!/usr/bin/env node

const url = "https://pokeapi.co/api/v2/pokemon/"

async function getNumber(speciesUrl) {
    const res = await fetch(speciesUrl)
    if (!res.ok) {
        console.error(res.statusText)
        return
    }
    const data = await res.json()
    return data.pokedex_numbers.find(o => o.pokedex.name === "national").entry_number
}

async function getSpecies(speciesUrl) {
    const res = await fetch(speciesUrl)
    if (!res.ok) {
        console.error(res.statusText)
        return
    }
    const data = await res.json()
    return data.genera.find(o => o.language.name === "en").genus
}

function getFtInHeight(dmHeight) {
    const inches = dmHeight * 3.937008
    const ft = Math.floor(inches / 12)
    const _in = Math.round(inches % 12)
    return { ft, in: _in }
}

function getLbWeight(hgWeight) {
    const weight = hgWeight * 0.2204623
    return Math.round(weight * 10) / 10
}

async function main() {
    if (process.argv.length !== 3) {
        console.error("Usage: pkmn-dex-string <pokémon name>")
        return
    }
    const mon = process.argv[2].toLowerCase()

    const res = await fetch(url + mon)
    if (!res.ok) {
        console.error(res.statusText)
        return
    }
    const data = await res.json()

    const number = await getNumber(data.species.url)
    const species = await getSpecies(data.species.url)
    const height = getFtInHeight(data.height)
    const weight = getLbWeight(data.weight)

    const svFormat = `NO. ${String(number).padStart(4, "0")}  ${species}  HT: ${height.ft}'${height.in}"  WT: ${weight} lbs.`
    console.log(svFormat)
}

main()
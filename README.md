# pkmn-dex-string
A node.js CLI app designed to generate Pokédex strings as seen on the border of most Pokémon cards. Uses the [PokéApi](https://pokeapi.co/) to fetch data, and parses into the desired format.

## Usage
Prerequisites: node.js (developed for version 20)
```bash
node index.js <pokémon name>
```

## Features
Currently, the app only supports generating strings for Pokémon in the Scarlet and Violet TCG format. That is, all Pokémon are available, but strings will only be formated in that specific way. In the future, formats will be able to be chosen from the various eras of the Pokémon TCG, and custom formats will be able to be specified.

Flags will also be added to generate multiple Pokémon's strings at once, and to change the format, as above.

## Bugs
Currently, because of the way PokéAPI works, the app doesn't handle Pokémon with forms well. For example, issuing the query `node index.js wormadam` returns no results, but `node index.js wormadam-trash` returns results for that form. I am currently working on finding a fix, but as is, it should work find for most Pokémon.
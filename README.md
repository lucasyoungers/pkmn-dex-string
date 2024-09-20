# pkmn-dex-string
A node.js CLI app designed to generate Pokédex strings as seen on the border of most Pokémon cards. Uses the [PokéApi](https://pokeapi.co/) to fetch data, and parses into the desired format.

## Installation
Prerequisites: npm, node.js (developed for npm 10, node 20)
```bash
cd pkmn-deck-string
npm install
```

## Usage
Prerequisites: node.js (developed for node 20)
```bash
node index.js <pokémon name>
```

### Flags
The `--batch`, or `-b` flag allows you to generate dex strings for a list of Pokémon at a time.
```bash
node index.js --batch <pokémon name 1> <pokémon name 2> ... <pokémon name n>
```

The `--delimiter`, or `-d` flag allows you to specify a custom delimeter for lists of deck strings. The default value is `\n`, or a newline character.
```bash
node index.js --delimiter=, <pokémon name>
```

The `--format`, or `-f` flag allows you to specify the format in which you wish the dex string to be generated. The default value for this is `sv`, but other formats are allowed (`swsh`, `sm`, `xy`, `bw`, `hgss`, `dppt`, `e`, `neo`, `gym`, `base`). To specify a custom format, you can use a string in quotations, with % signs to signify placeholders for dex number (%Xn, where X is the number of 0s used to pad the number), species (%s), height in feet (%f), remaining height in inches (%i), and weight in pounds (%Xw, where X is the number of decimal places). To escape a quotation, use `\"` within your string.
```bash
node index.js --format="NO. %4n  %s  HT: %f'%i\"  WT: %w lbs." <pokémon name>
```

## Features
Currently, the app only supports generating strings for Pokémon in the Scarlet and Violet TCG format. That is, all Pokémon are available, but strings will only be formated in that specific way. In the future, formats will be able to be chosen from the various eras of the Pokémon TCG, and custom formats will be able to be specified.

Flags will also be added to generate multiple Pokémon's strings at once, and to change the format, as above.

## Bugs
Currently, because of the way PokéAPI works, the app doesn't handle Pokémon with forms well. For example, issuing the query `node index.js wormadam` returns no results, but `node index.js wormadam-trash` returns results for that form. I am currently working on finding a fix, but as is, it should work find for most Pokémon.

Some delimiters are broken, such as \t and \n. Support for these will come in the future, but for now, the most important seems to be \n, which is the default option. If you want a linebreak between each entry, leave the `-d` or `--delimiter` flag off.
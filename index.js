// Modulos requeridos.
const http = require("http");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const puerto = 3000;

// Funcion asincrona que retorna como resultado la data de 151 pokemones. 
const getPokemones = async () => {
    const {data} = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151")
    return data.results
}

// Funcion asincrona que retorna la data de la URL en cuestion.
const getData = async (url) => {
    const {data} = await axios.get(url)
    return data
}

// Se Levanta servidor en puerto: 3000.
http
    .createServer((req, res) => {
        // Endpoint principal Galeria Pokemones.
        if (req.url == "/") {
            res.writeHead(200, {"Content-Type": "text/html"})
            fs.readFile("index.html", "utf-8", (err, html) => {
                res.end(html)
            })
        }
        // Endpoint formato JSON pokemones.
        else if (req.url == "/pokemones") {
            const pokemones = [];
            const datosPokemones = [];
            res.writeHead(200, {'Content-Type': 'application/json'})

            // Se recorre y se inserta data en array "pokemones" y "datosPokemones".
            getPokemones().then((results) => {
                results.forEach((e) => {
                    pokemones.push(getData(e.url))
                });
                Promise
                    .all(pokemones)
                    .then((data) => {
                        data.forEach((e) => {
                            let nombre = e.name
                            let img = e.sprites.front_default

                            datosPokemones.push({nombre, img})
                        })
                        res.write(JSON.stringify(datosPokemones))
                        res.end()
                    })
            })
        }
    })
    // Servidor escucha por el puerto 3000.
    .listen(puerto,() => console.log(chalk.green(`Servidor ON Puerto: ${puerto}`)));

    // Se inicia servidor por nodemon: "npx nodemon index.js" .
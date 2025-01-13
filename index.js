
    /* ████████████████████████████████████████ OPTIONS ████████████████████████████████████████ */

const PORT = 3000;
const TEST = false;
const CORS = true; /* Enable or disable Cors */
const AccessDomain = '*' // Domain for access API: '*' (All) or 'http://example.com' (Current)

    /* ████████████████████████████████████████ MODULES ████████████████████████████████████████ */

require('colors');
// import fs from 'fs';
const fs = require('fs/promises');
const fsProm = require('fs').promises;
const fsSync = require('fs');
const path = require("path");
const cors = require('cors');
const express = require('express'); // Include express
const app = express(); // Initialization express
// require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();

// import runGenId from './extension/GeneratorID_v.1.2';
const runGenId = require("./extension/GeneratorID_v.1.2.js");
const { getDateA, getDateB, getTimeA, getTimeB, getDateC } = require("./extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('./extension/ReturnsURL_v.0.2'); 

    /* ████████████████████████████████████████ CORS ████████████████████████████████████████ */

if (CORS) {
    const corsOptions = {
        origin: AccessDomain, // Domain: 'http://example.com'
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    // app.use(cors()); // Allow all request
    app.use(cors(corsOptions)); // Allow request with options
} else {
    // app.options('*', cors()) // include before other routes
    app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', AccessDomain); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
    });
}

// Визначає параметри парсингу: 
// false - парсинг набір пар ключ-значення у вигляді рядка або масиву.
// true - парсер використовує іншу бібліотеку для розбору формату рядка.
app.use(express.urlencoded({ extended: false })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.
app.use(express.json()); // parse application/json

    /* ████████████████████████████████████████ TEST Code ████████████████████████████████████████ */

app.use((request, response, next) => {
    if (TEST) {
        const obj = {
            body: Object.assign({}, request.body) || request.body,
            query: request.query,
            params: request.params,
        };
        console.log("Receive data Test:", obj)
    };
    next();
});

if (TEST) {
console.log("Test enabled.".yellow)
    /* Test */
// URL Test
app.get('/test/:value?', (request, response) => { // http://127.0.0.1:3000/test/data?page=1&limit=5
    const datareq = {
        ip: request.ip,
        url: request.url,
        method: request.method,
        body: request.body || null,
        query: request.query, // Data in {?}
        params: request.params, // Data in {:value}
        headers: request.headers,
    };
    response.json(datareq);
});
    /* Information project */
console.log("Dirrectory:".blue, __dirname);
console.log("File name:".blue, __filename);
console.log("Process argv:".blue, process.argv);
} else { console.log("Test disabled.".yellow) };

    /* ████████████████████████████████████████ GLOBAL Code ████████████████████████████████████████ */
    
console.log('Starting API ...'.yellow);
// Add control - if (process.argv) { command(process.argv); };

app.get('/favicon.ico', (request, response) => {
  response.sendFile(path.join(__dirname, 'favicon.ico'));
});

    /* ████████████████████████████████████████ ROUTES ████████████████████████████████████████ */
const freeCodeCampAPI = require('./routes/freeCodeCamp.js');
app.use('/freeCodeCamp', freeCodeCampAPI);


    /* ████████████████████████████████████████ GLOBAL ERRORS: 404 / 500 ████████████████████████████████████████ */

app.use((_, response, __) => {
    const code = 404;
    response.status(code).json(returns(code, 'Not found'));
});

app.use((error, _, response, __) => {
    const code = 500;
    console.log(error.stack);
    response.status(code).json(returns(code, `Fail. ${error.message}`));
});

// Обработка всех других маршрутов

app.listen(PORT, () => {
    console.log(`Start successfull API on server port: ${PORT}.`.green);
    if (TEST) {
        console.log(`Server is running on http://127.0.0.1:${PORT}/`.blue);
        console.log(`Server is running on http://localhost:${PORT}/`.blue);
    };
    }
);

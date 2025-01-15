
const TEST = false;

require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
router.use(express.json()); // Automatic parse JSON
router.use(express.urlencoded({ extended: true })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.

const bodyParser = require("body-parser");
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

// Middleware для CORS
// const cors = require('cors');
// router.use(cors());

const { getDateA, getDateB, getDateC, getTimeA, getTimeB } = require("../extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('../extension/ReturnsURL_v.0.2');
const runGenId = require("../extension/GeneratorID_v.1.2.js");



      /* ████████████████████████████████████████ ROUTES AND API ████████████████████████████████████████ */

const timestamp = require('./fcc_timestamp.js');
router.use('/timestamp', timestamp); /* READY FOR TEST AND TESTED */

const fileanalyse = require('./fcc_fileanalyse.js');
router.use('/analyse', fileanalyse); /* READY FOR TEST AND TESTED */

const task = require('./fcc_task.js');
router.use('/task', task);

const url = require('./fcc_url.js');
router.use('/url', url); /* READY FOR TEST AND TESTED */

/* =========  ========= API =========  ========= */


/* READY FOR TEST AND TESTED */
// Мікросервіс парсингу заголовків запиту
router.use('/api/whoami', (request, response) => {
    const operation_method = "GET";
    try {
        if (request.method.toString().toUpperCase() === operation_method) {
            const code = 200;
            const data = {
                host: request.headers['host'],
                ipaddress: request.ip,
                language: request.headers['accept-language'],
                software: request.headers['user-agent'],
                format: request.headers['accept'],
                encoding: request.headers['accept-encoding'],
                connection: request.headers['connection'],
            };
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(Object.assign({}, returns(code, null), data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));
    }
});



  
  router.use((_, response, __) => {
    const code = 404;
    const data = {
        error: "invalid url"
    }
    const add = returns(code, null);
    response.status(code).json({...data, ...add});
    // return response.json({ error: 'invalid url' });
});

module.exports = router;

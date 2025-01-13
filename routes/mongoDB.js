require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
router.use(express.json()); // Automatic parse JSON
router.use(express.urlencoded({ extended: false })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.
const { getClusterModel } = require('../extension/mongoDB_v.0.2');
const { getDateA, getDateB, getTimeA, getTimeB, getDateC } = require("../extension/CurrentDateTimeNode_v.1.0");
const returns = require('../extension/ReturnsURL_v.0.2');
const requestform = require('../extension/RequestForm_v.0.2'); 

/*
GET - Получение объекта (ресурса).
POST — создание нового объекта (ресурса). 
PUT — полная замена объекта (ресурса) на обновленную версию. 
PATCH — частичное изменение объекта (ресурса).
DELETE - удаление объекта (ресурса).
*/

/* =========  ========= Options =========  ========= */

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']; // Укажите допустимые методы
const TEST = false; /* Test: true / false */

if (TEST) {
    console.log("Test Database URL - Enabled.".yellow) 
} else {
    console.log("Test Database URL - Disabled.".yellow) 
};

/* =========  ========= Functions =========  ========= */

function validObj(obj, keys) {
    if (!Array.isArray(keys)) {
        throw new TypeError('Error. Keys must be an array...');
    } else {
        return keys.every(key => obj.hasOwnProperty(key) && obj[key] !== undefined);
    };
};

const validateRequest = (request, requiredKeys, method) => {
    if (!validObj(request, requiredKeys)) {
        return { valid: false, code: 400, message: `Keys required: ${requiredKeys.join(', ')}` };
    }
    if (request.method.toUpperCase() !== method) {
        return { valid: false, code: 405, message: 'Method not allowed' };
    }
    return { valid: true };
};

/* =========  ========= Test data =========  ========= */

router.use((request, response, next) => { 
    if (TEST) {
        const datareq = requestform(request) || request;
        console.log("Test format request:".blue, datareq);
    };
    next();
});

router.get('/', (request, response) => {
    if (request.method.toString().toUpperCase() === "GET") {
        const code = 200;
        response.status(code).json(returns(code, true));
    } else {
        const code = 405;
        response.status(code).json(returns(code, false));
    };
});

router.get('/help', (request, response) => {
    if (request.method.toString().toUpperCase() === "GET") {
        const code = 207;
        response.status(code).json(returns(code, {
            operation_global: [
                `Database API Instruction.`,
                'Use next URL for operations with database:',
                'GET | Status Database - ".../mongo-db/"',
                'GET | Help for API Database - ".../mongo-db/help"',
            ],
            operation_data: [
                `Database (data) API Instruction.`,
                'Use next URL for operations with data:',
                'GET | Get all information with name file - ".../mongo-db (/all, /all?, /all/:filename?)"',
                'GET | Get element in file - ".../mongo-db (/get, /get?, /get/:filename?, /get/:filename/:id?)',
                'PATCH | Update (part) element in file with data - ".../mongo-db (/update, /update?, /update/:filename?, /update/:filename/:id?, /update/:filename/:id/:data?)"',
                'PUT | Update (all) element in file with data - ".../mongo-db (/remake, /remake?, /remake/:filename?, /remake/:filename/:id?, /remake/:filename/:id/:data?)"',
                'POST | Create element in file with data - ".../mongo-db (/add, /add?, /add/:filename?, /add/:filename/:data?)"',
                'DELETE | Delete element in file with data - ".../mongo-db (/cut, /cut?, /cut/:filename?, /cut/:filename/:id?)"',
            ],
            information: [
                'Database MongoDB (with Mongoose)',
                'Version: 0.2 - 12.12.2024',
                'Made by Anatolii Ovcharuk - https://github.com/Anatolii-Ovcharuk'
            ],
        }
    ));
    } else {
        const code = 405;
        response.status(code).json(returns(code, false));
    };
});

/* ██████████████████████████████████████████████████ Operations with data ██████████████████████████████████████████████████ */

/* =========  ========= Receive data =========  ========= */

router.all(['/all', '/all?', '/all/:filename?' ], async (request, response) => {
    const operation_method = "GET";
    const keysToCheck = ["filename"];
    // console.log("Request data:".blue, request.body, request.query, request.params);
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        // console.log("Form object:".blue, object);
        if (!validObj(object, keysToCheck)) {
            const code = 400;
            response.status(code).json(returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const code = 200;
            const { filename } = object; // Получаем значение filename из параметров
            const cluster = getClusterModel(filename);
            const data = await cluster.find({});
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(returns(code, data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 404;
        response.status(code).json(returns(code, error.message));
    }
});

router.all(['/get', '/get?', '/get/:filename?', '/get/:filename/:id?'], async (request, response) => {
    const operation_method = "GET";
    const keysToCheck = ["filename", "id"];
    // console.log("Request data:".blue, request.body, request.query, request.params);
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        // console.log("Form object:".blue, object);
        if (!validObj(object, keysToCheck)) {
            const code = 400;
            response.status(code).json(returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const code = 200;
            const { filename, id } = object; // Получаем значение filename из параметров
            const filter = id ? id : {}; // Формируем условие фильтрации
            const cluster = getClusterModel(filename);
            const data = await cluster.findById(filter);
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(returns(code, data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 404;
        response.status(code).json(returns(code, error.message));
    }
});

/* =========  ========= Add data =========  ========= */

router.all(['/add', '/add?', '/add/:filename?', '/add/:filename/:data?'], async (request, response) => {
    const operation_method = "POST";
    const keysToCheck = ["filename", "data"];
    // console.log("Request data:".blue, request.body, request.query, request.params);
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        // console.log("Form object:".blue, object);
        if (!validObj(object, keysToCheck)) {
            const code = 400;
            response.status(code).json(returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const code = 201;
            const { filename } = object; // Получаем значение filename из параметров
            const cluster = getClusterModel(filename);
            const data = await cluster.create(JSON.parse(object.data));
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(returns(code, data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 404;
        response.status(code).json(returns(code, error.message));
    }
});


/* =========  ========= Update (part) data =========  ========= */

router.all(['/update', '/update?', '/update/:filename?', '/update/:filename/:id?', '/update/:filename/:id/:data?'], async (request, response) => {
    const operation_method = "PATCH";
    const keysToCheck = ["filename", "id", "data"];
    // console.log("Request data:".blue, request.body, request.query, request.params);
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        // console.log("Form object:".blue, object);
        if (!validObj(object, keysToCheck) || Object.keys(object).length === 0) {
            const code = 400;
            response.status(code).json(returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const code = 201;
            const { filename, id } = object; // Получаем значение filename из параметров
            const cluster = getClusterModel(filename);
            const data = await cluster.findByIdAndUpdate(id, JSON.parse(object.data));
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(returns(code, data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 404;
        response.status(code).json(returns(code, error.message));
    }
});

/* =========  ========= Update (all) data =========  ========= */

router.all(['/remake', '/remake?', '/remake/:filename?', '/remake/:filename/:id?', '/remake/:filename/:id/:data?'], async (request, response) => {
    const operation_method = "PUT";
    const keysToCheck = ["filename", "id", "data"];
    // console.log("Request data:".blue, request.body, request.query, request.params);
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        // console.log("Form object:".blue, object);
        if (!validObj(object, keysToCheck) || Object.keys(object).length === 0) {
            const code = 400;
            response.status(code).json(returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const code = 201;
            const { filename, id } = object; // Получаем значение filename из параметров
            const cluster = getClusterModel(filename);
            const data = await cluster.findByIdAndUpdate(id, JSON.parse(object.data), { new: true });
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(returns(code, data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 404;
        response.status(code).json(returns(code, error.message));
    }
});

/* =========  ========= Delete data =========  ========= */

router.all(['/cut', '/cut?', '/cut/:filename?', '/cut/:filename/:id?'], async (request, response) => {
    const operation_method = "DELETE";
    const keysToCheck = ["filename", "id"];
    // console.log("Request data:".blue, request.body, request.query, request.params);
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        // console.log("Form object:".blue, object);
        if (!validObj(object, keysToCheck) || Object.keys(object).length === 0) {
            const code = 400;
            response.status(code).json(returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const code = 200;
            const { filename, id } = object; // Получаем значение filename из параметров
            const cluster = getClusterModel(filename);
            const data = await cluster.findByIdAndDelete(id);
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(returns(code, data));
        } else {
            const code = 405;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 404;
        response.status(code).json(returns(code, error.message));
    }
});

/* ██████████████████████████████████████████████████ Errors and exports modules ██████████████████████████████████████████████████ */


router.use((request, response, __) => {
    if (!allowedMethods.includes(request.method.toString().toUpperCase())) {
        const code = 405;
        response.status(code).json(returns(code));
    } else {
        const code = 404;
        response.status(code).json(returns(code));
    }
});

// router.use((_, response, __) => {
//     const code = 404;
//     response.status(code).json(returns(code));
// });

router.use((error, _, response, __) => {
    const code = 500;
    console.log(error.stack);
    response.status(code).json(returns(code, error.message));
});

module.exports = router;

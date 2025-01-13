
const TEST = false;

require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
router.use(express.json()); // Automatic parse JSON
router.use(express.urlencoded({ extended: false })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.

const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const multer = require('multer');

// Middleware для загрузки файлов и CORS
// router.use(cors());
const upload = multer({ dest: 'uploads/' }); // Где временно хранятся файлы
router.use(fileUpload());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

const { getDateA, getDateB, getDateC, getTimeA, getTimeB } = require("../extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('../extension/ReturnsURL_v.0.2');
const runGenId = require("../extension/GeneratorID_v.1.2.js");
const { User, Exercise, TaskUser, } = require('../extension/mongoDB_v.0.2.js');

/* =========  ========= Local Database =========  ========= */

// Данные URL-ссылок
const urlDatabase = {};
let urlCounter = 0;

// Данные Пользователей
const userDatabase = [];

/* =========  ========= Functions =========  ========= */

function validObj(obj, keys) {
    if (!Array.isArray(keys)) {
        throw new TypeError('Error. Keys must be an array...');
    } else {
        return keys.every(key => obj.hasOwnProperty(key) && obj[key] !== undefined);
    };
};

function cheсk_valid(string, reg, obj) {
    if (obj.hasOwnProperty(string)) {
        return reg.test(obj[string])
    } else {
        return true;
    };
}




/* =========  ========= API =========  ========= */

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





// Мікросервіс скорочування URL-адрес
router.use('/api/shorturl/:value?', (request, response) => {
    const operation_method = "GET";
    const keysToCheck = [];

    try {
        const valid_method = request.method.toString().toUpperCase() !== operation_method;
        const object = Object.assign({}, request.params, request.query, request.body);       
        const regex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/i;

        // Проверка на метод
        if (valid_method) {
            const code = 405;
            response.status(code).json(returns(code));
            return null;
        }
        // Проверка на ключи и валидность данных
        else if (!validObj(object, keysToCheck) || !cheсk_valid("original_url", regex, object)) {
            const code = 400;
            const data = returns(code, `Not all keys are present in objects or invalid url (Not valid url).`);
            response.status(code).json(Object.assign({}, data, { error: "invalid url" }));
            return null;
        }
        // Поиск и переадресация на ссылку
        else if (object.hasOwnProperty('value') && object.value !== undefined) {
            const code = 308;
            const originalUrl = urlDatabase[object.value];
            if (!originalUrl) {
                const code = 404;
                const data = returns(code, `No short URL found for the given input.`);
                response.status(code).json(Object.assign({}, data, { error: "No short URL found for the given input" } ));
                return null;
            };
            response.redirect(code, originalUrl);
            return null;
        }
        // Регистрация новой ссылки
        else if (object.hasOwnProperty('original_url')) {
            const code = 200;
            const shortUrl = urlCounter++;
            urlDatabase[shortUrl] = object.original_url;
            const data = {
                original_url: object.original_url,
                short_url: shortUrl,
                encode_uri: encodeURIComponent(object.original_url),
                decode_uri: decodeURIComponent(object.original_url),
            };
            response.status(code).json(Object.assign({}, returns(code, null), data));
            return null;
        // Отсутствуют ключи
        } else {
            const code = 400;
            const data = returns(code, `Not all keys are present in objects (Keys: original_url or value).`);
            response.status(code).json(Object.assign({}, data, { error: "invalid url" }));
            return null;
        };

    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));
        return null;
    }
});





// Трекер вправ - [ ] = optional; from, to = dates (yyyy-mm-dd); limit = number;
router.use(['/api/users', '/api/users/:_id/exercises', '/api/users/:_id/logs', '/api/users/:_id/logs?[from][&to][&limit]'], upload.single('upfile'), async (request, response) => {
    const req_method = request.method.toString().toUpperCase();
    const keysToCheck = ["_id", "description", "duration", "date"];
    try {
        const object = Object.assign({}, request.params, request.query, request.body); 
        function valid(obj, str) {
            return obj.hasOwnProperty(str);
        }

        
        // POST /api/users - Создание пользователя с ключом "username"
        if (req_method === "POST" && valid(object, "username")) {
            const code = 201;
            const idUniq = runGenId(3, true, false, false);
            const data = {
                _id: idUniq,
                username: object.username,
                log: [],
                count: log.length || 0,
            };
            const result = await TaskUser.create(data);
            const user = await User.create({
                _id: idUniq,
                username: object.username,
            });
            response.status(code).json(Object.assign({}, returns(code, null), data));
        }
        // POST /api/users/:_id/exercises - Создание задания для пользователя по id
        else if (req_method === "POST" && validObj(object, keysToCheck)) {
            const code = 201;
            const { description, duration, date } = object;
            const data = {
                description,
                duration,
                date: new Date(date) || new Date().toString(),
            };
            const result = await TaskUser.findByIdAndUpdate(_id, {
                $push: { log: data },
                $inc: { count: 1 }
            },
            { new: true });
            response.status(code).json(Object.assign({}, returns(code, null), data));
        // GET /api/users/:_id/logs?[from][&to][&limit] - Поиск данных
        } else if (req_method === "GET" && request.path.includes('logs')) {
            const code = 200;
            const { from, to, limit } = request.query;
            const user = await TaskUser.findById(_id);

            if (!user) {
                const code = 404;
                return res.status(code).json(Object.assign({}, returns(code, null), { error: 'User not found' }));
            };

            if (from || to) {
                exercises = exercises.filter(exercise => {
                    const exerciseDate = new Date(exercise.date);
                    return (!from || exerciseDate >= new Date(from)) &&
                        (!to || exerciseDate <= new Date(to));
                });
            }

            let exercises = user.log;
            if (limit) {
                exercises = exercises.slice(0, Number(limit));
            };

            const data = {
                username: user.username,
                _id: user._id,
                log: exercises.map(e => ({
                    description: e.description,
                    duration: e.duration,
                    date: e.date || Date.now() || new Date().toString(),
                count: this.log.length,
                })),
            };
            response.status(code).json(Object.assign({}, returns(code, null), data));  
        // GET /api/users/ - Return all users
        } else if (req_method === "GET") {
            const code = 200;
            const users = await User.find({});
            response.status(code).json(Object.assign({}, returns(code, null), users));  
        } else if (req_method === "DELETE" || req_method === "PUT") {
            const code = 405;
            response.status(code).json(returns(code));
        } else if (!validObj(object, keysToCheck)) {
            const code = 400;
            const data = returns(code, `Not all keys are present in objects or invalid url (Not valid url).`);
            response.status(code).json(Object.assign({}, data, { error: "invalid url" }));
        } else {
            const code = 404;
            response.status(code).json(returns(code));
        };
    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));
    }
});








// Мікросервіс метаданих файлу
router.use('/api/fileanalyse', (request, response) => {
    const operation_method = "GET";
    try {
        if (!request.file || !request.files || !request.files.upfile) {
            const code = 400
            return response.status(code).json(Object.assign({}, returns(code, null), { error: 'No file uploaded' }));
        } else if (request.method.toString().toUpperCase() === operation_method) {
            const { originalname, mimetype, size } = request.file;
            const file = request.files.upfile;
            const code = 200;
            const data = {
                name: originalname || file.name,
                type: mimetype || file.mimetype,
                size: size || file.size,
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







// Мікросервіс часової мітки
router.use('/api/:date?', (request, response, next) => {
    const operation_method = "GET";
    const keysToCheck = ["date"];
    try {
        const object = Object.assign({}, request.params, request.query, request.body);
        const valid_method = request.method.toString().toUpperCase() !== operation_method;
        const opt = object.hasOwnProperty("date");
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/; // Формат "YYYY-MM-DD"
        const unixTimestampRegex = /^\d+$/; // Числовой формат (UNIX)

        // Проверка на метод
        if (valid_method) {
            const code = 405;
            response.status(code).json(returns(code));
            return null;
        }
        // Проверка на ключи
        else if (!opt) {
            next();
            return;
        }
        // Проверка на ключи и валидность данных
        
        else if (!validObj(object, keysToCheck) || !(cheсk_valid('date', isoDateRegex, object) || cheсk_valid('date', unixTimestampRegex, object))) {
            const code = 400;
            const data = returns(code, `Not all keys are present in objects. Keys must be: ${keysToCheck.map(item => " " + item)}.`);
            response.status(code).json(Object.assign({}, data));
            return null;
        }
        // Формирование даты
        else if (object.hasOwnProperty('date')) {
            const code = 200;
            let value = Math.round(object.date);
            let formatted = new Date(value) && new Date(object.date);
            if (cheсk_valid('date', isoDateRegex, object)) {
                formatted = new Date(object.date);
            } else if (cheсk_valid('date', unixTimestampRegex, object)) {
                formatted = new Date(value);
            };
            const unx = Math.floor(formatted.getTime());
            const data = {
                utc: formatted.toString(),
                unix: unx,
                utcA: getDateA(unx),
                utcB: getDateB(unx, false),
                utcC: getDateC(unx),
                timeA: getTimeA(unx),
                timeB: getTimeB(unx),
            };
            if (TEST) { console.log(`${operation_method} ${request.url} Data Test:`.blue, data); };
            response.status(code).json(Object.assign({}, returns(code, null), data));
        // Отсутствуют ключи
        } else {
            const code = 404;
            response.status(code).json(returns(code, null));
            return null;
        };
    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));
    }
});






module.exports = router;

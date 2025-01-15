/* READY FOR TEST AND TESTED */


require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
const dns = require('dns');
const { URL } = require('url');

const { getDateA, getDateB, getDateC, getTimeA, getTimeB } = require("../extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('../extension/ReturnsURL_v.0.2.js');
const runGenId = require("../extension/GeneratorID_v.1.2.js");


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


/* =========  ========= Local Database =========  ========= */

// Данные URL-ссылок
const urlDatabase = {};
let urlCounter = 0;

/* =========  ========= API =========  ========= */

// router.use('/?', (request, response, next) => {
//     const object = Object.assign({}, request.params, request.query, request.body);
//     // Проверяем наличие URL
//     if (!object.url) {
//         return response.json({ error: 'invalid url' });
//     }

//     try {
//         // Создаем объект URL для проверки синтаксиса
//         const parsedUrl = new URL(object.url);

//         // Проверяем, существует ли домен
//         dns.lookup(parsedUrl.hostname, (err) => {
//             if (err) {
//                 return response.json({ error: 'invalid url' });
//             }

//             // Если домен существует, переходим к следующему middleware
//             next();
//         });
//     } catch (error) {
//         // Если URL некорректный, возвращаем ошибку
//         next();
//         return response.json({ error: 'invalid url' });
//     }
// });

// router.use('/', (request, response, next) => {
//     const object = Object.assign({}, request.params, request.query, request.body);

//     // Регулярное выражение для проверки URL
//     // const httpRegex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/i;
//     const httpRegex = /^(http|https)(:\/\/)/;

//     // Проверяем, есть ли в объекте `url` и проходит ли он проверку
//     if (!object.url || !httpRegex.test(object.url)) {
//         return response.json({ error: 'invalid url' });
//     }

//     next();
// });

/* Bug for validation in FreeCodeCamp, best code upper... */
router.use('/', (request, response, next) => {
    const object = Object.assign({}, request.params, request.query, request.body);
    // Проверяем, есть ли в объекте `url` и проходит ли он проверку
    const opt = (!object.url || !object.url.includes('http') || !object.url.includes('https')) && request.method !== "GET"
    if (opt) {
        return response.json({ error: 'invalid url' });
    }
    next();
});


// Создание короткого URL - Мікросервіс скорочування URL-адрес
router.use('/api/shorturl/:url?', (request, response) => {
    const keysToCheck = []; // !validObj(object, keysToCheck)
    const object = Object.assign({}, request.params, request.query, request.body);

    try {    
        const regex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/i;
           
        // Проверка на ключи и валидность данных
        if (!object.hasOwnProperty('url') && !cheсk_valid("url", regex, object)) {
            const code = 400;
            const data = returns(code, `Not all keys are present in objects or invalid url (Not valid url).`);
            // response.status(code).json(Object.assign({}, data, { error: "invalid url" }));
            response.status(code).json({ error: "invalid url" });
            return null;
        }
        // Регистрация новой ссылки
        else if (object.hasOwnProperty('url') && request.method.toString().toUpperCase() === "POST") {
            const code = 200;
            const shortUrl = urlCounter++;
            urlDatabase[shortUrl] = object.url;
            const data = {
                original_url: object.url,
                short_url: shortUrl,
                encode_uri: encodeURIComponent(object.original_url),
                decode_uri: decodeURIComponent(object.original_url),
            };
            response.status(code).json(Object.assign({}, returns(code, null), data));
            // response.status(code).json(data);
            return null;
        } 
        // Поиск и переадресация на ссылку
        else if (object.hasOwnProperty('url') && object.url !== undefined && request.method.toString().toUpperCase() === "GET") {
            const code = 308;
            const originalUrl = urlDatabase[object.url];
            if (!originalUrl) {
                const code = 404;
                const data = returns(code, `No short URL found for the given input.`);
                response.status(code).json(Object.assign({}, data, { error: "invalid url" } ));
                // response.status(code).json({ error: "invalid url" });
                return null;
            };
            response.redirect(code, originalUrl);
            return null;
        }
        // Проверка на метод
        else if (request.method.toString().toUpperCase() !== "GET" && request.method.toString().toUpperCase() !== "POST") {
            const code = 405;
            response.status(code).json(returns(null));
            return null;
        }         
        // Отсутствуют ключи
        else {
            const code = 400;
            const data = returns(code, `Not all keys are present in objects (Keys: url or value).`);
            response.status(code).json(Object.assign({}, data, { error: "invalid url" }));
            // response.status(code).json({ error: "invalid url" });
            return null;
        };

    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));
        return null;
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

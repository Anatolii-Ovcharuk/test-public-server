
require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
router.use(express.json()); // Automatic parse JSON
router.use(express.urlencoded({ extended: true })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.

const bodyParser = require('body-parser');
// Настройка парсинга данных в формате x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));

const { getDateA, getDateB, getDateC, getTimeA, getTimeB } = require("../extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('../extension/ReturnsURL_v.0.2');
const runGenId = require("../extension/GeneratorID_v.1.2.js");
const { User, Exercise, TaskUser, } = require('../extension/mongoDB_v.0.2.js');

const moment = require('moment');


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

// Трекер вправ - [ ] = optional; from, to = dates (yyyy-mm-dd); limit = number;


router.post('/api/users/:_id/exercises', async (request, response) => {
    const keysToCheck = ["_id"]; // "_id", "description", "duration", "date"
    const req_method = request.method.toString().toUpperCase();
    // const object = Object.assign({}, request.params, request.query, request.body); 
    const object = { ...request.params, ...request.query, ...request.body };

    try {
        if (req_method !== "POST") {
            const code = 405;
            response.status(code).json(returns(code));
        } else if (!validObj(object, keysToCheck)) {
            console.log(object)
            const code = 400;
            const data = returns(code, `Not all keys are present in objects or invalid url (Not valid url).`);
            response.status(code).json(Object.assign({}, data, { error: "invalid url" }));
        } 
        // POST /api/users/:_id/exercises - Return exercises
        // POST /api/users/:_id/exercises - Создание задания для пользователя по id
        else if (request.url.includes("exercises") && req_method === "POST") {
            const code = 200;
            console.log(object)
            const {description, duration, date} = object;
            const usr = await User.findOne({_id: object._id});
            const obj = {
                description: description.replace(/^"|"$/g, ''), // Удаляем лишние кавычки
                duration: parseInt(duration.replace(/^"|"$/g, ''), 10), // Преобразуем в число
                date: date === undefined ? new Date().toString() || Date.now() : new Date(date.replace(/^"|"$/g, '')) , // Преобразуем в дату
            }
            const updatedUser = await TaskUser.findOneAndUpdate(
                { _id: object._id }, // Поиск по id
                { $push: { log: obj } }, // Добавление нового объекта в массив log
                { $inc: { count: 1 } },   // Увеличение значения на 1
                { new: true }, // Возвращает обновленный документ
            );

            response.status(code).json({...obj, ...usr._doc});  
        } else {
            const code = 404;
            response.status(code).json(returns(code));
        };
        
    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));        
    }
}
)







router.get(['/api/users/:_id/logs', '/api/users/:_id/logs?[from][&to][&limit]'], async (request, response) => {
    try {
    // const object = Object.assign({}, request.params, request.query, request.body); 
    const object = { ...request.params, ...request.query, ...request.body };
      const { from, to, limit, _id } = object;
      // Находим пользователя по _id
      const user = await TaskUser.findById(_id);
      
    if (!user) {
        const code = 404;
        return response.status(code).json(Object.assign({}, returns(code, null), { error: 'User not found' }));
    };
  
      // Фильтруем массив log
      let filteredLog = user.log;
  
      if (from || to) {
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;
  
        filteredLog = filteredLog.filter((exercise) => {
          const exerciseDate = new Date(exercise.date);
          return (
            (!fromDate || exerciseDate >= fromDate) &&
            (!toDate || exerciseDate <= toDate)
          );
        });
      }
  
      // Применяем лимит, если он указан
      if (limit) {
        filteredLog = filteredLog.slice(0, Number(limit));
      }
  
      // Формируем ответ
        const data = {
            username: user.username,
            count: filteredLog.length,
            _id: user._id,
            log: filteredLog.map((exercise) => ({
                description: exercise.description,
                duration: exercise.duration,
                date: new Date(exercise.date).toDateString(),
            }))
        };
        response.json(data);
        
    } catch (error) {
        const code = 500;
        response.status(code).json(returns(code, error.message));
    }
  });








router.use(['/api/users'], async (request, response) => {
    const req_method = request.method.toString().toUpperCase();
    try {
        // const object = Object.assign({}, request.params, request.query, request.body); 
        const object = { ...request.params, ...request.query, ...request.body };
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
                count: 0,
            };
            const result = await TaskUser.create(data);
            const user = await User.create({
                _id: idUniq,
                username: object.username,
            });
            response.status(code).json(Object.assign({}, returns(code, null), data));
        }
        // GET /api/users/ - Return all users
        else if (req_method === "GET" && !request.url.includes("exercises")) {
            const code = 200;
            const users = await User.find({});
            const result = users.map(el => ({
                username: el.username,
                _id: el._id,
            }));
            response.status(code).json(result);  
            // response.status(code).json(Object.assign({}, returns(code, null), users));  
        } else if (req_method !== "GET") {
            const code = 405;
            response.status(code).json(returns(code));
        } else {
            const code = 404;
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

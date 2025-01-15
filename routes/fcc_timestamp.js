/* READY FOR TEST AND TESTED */


require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
router.use(express.json()); // Automatic parse JSON
router.use(express.urlencoded({ extended: false })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.

const { getDateA, getDateB, getDateC, getTimeA, getTimeB } = require("../extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('../extension/ReturnsURL_v.0.2.js');
const runGenId = require("../extension/GeneratorID_v.1.2.js");




// Мікросервіс часової мітки
router.use('/api/:date?', (request, response) => {
    const operationMethod = "GET";
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/; // Формат "YYYY-MM-DD"
    const unixTimestampRegex = /^\d+$/; // Числовой формат (UNIX)
    const { date } = request.params;
  
    try {
        // Проверка метода
            if (request.method.toUpperCase() !== operationMethod) {
                const code = 405;
                return response.status(code).json(Object.assign({}, returns(code), { error: "Method Not Allowed" }));
            }
    
        // Пустой параметр: возвращаем текущую дату
        if (!date) {
            const code = 200;
            const now = new Date();
            const data = { 
                unix: now.getTime(), 
                utc: now.toUTCString(),
                utcA: getDateA(this.utc),
                utcB: getDateB(this.utc, false),
                utcC: getDateC(this.utc),
                timeA: getTimeA(this.utc),
                timeB: getTimeB(this.utc),
            };
            return response.status(code).json(Object.assign({}, returns(code), data));
        }
    
        // Проверка формата даты
        let parsedDate;
        if (isoDateRegex.test(date)) {
            parsedDate = new Date(date);
        } else if (unixTimestampRegex.test(date)) {
            parsedDate = new Date(parseInt(date, 10));
        } else {
            parsedDate = new Date(date); // Попытка распарсить как строку
        }
    
        // Проверка корректности распарсенной даты
        if (isNaN(parsedDate.getTime())) {
            const code = 400;
            return response.status(code).json(Object.assign({}, returns(code), { error: `Invalid Date` }));
        }
    
        // Возвращаем валидную дату
        const result = { 
            unix: parsedDate.getTime(), 
            utc: parsedDate.toUTCString(), 
            utcA: getDateA(this.utc),
            utcB: getDateB(this.utc, false),
            utcC: getDateC(this.utc),
            timeA: getTimeA(this.utc),
            timeB: getTimeB(this.utc),
        };
        return response.status(200).json(Object.assign({}, returns([]), result));
    } catch (error) {
    // Обработка непредвиденных ошибок
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

/* READY FOR TEST AND TESTED */

const TEST = false;

require('colors');
const express = require('express'); // Include express
const router = express.Router(); // Include routes in express
router.use(express.json()); // Automatic parse JSON
router.use(express.urlencoded({ extended: false })); // Oбрабатывает данные формы, отправленные в формате application/x-www-form-urlencoded.

// Middleware для загрузки файлов
// const fileUpload = require('express-fileupload');
// router.use(fileUpload());
const multer = require('multer');
// Налаштування зберігання файлів для multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' }); // Где временно хранятся файлы

const { getDateA, getDateB, getDateC, getTimeA, getTimeB } = require("../extension/CurrentDateTimeNode_v.1.0.js");
const returns = require('../extension/ReturnsURL_v.0.2.js');
const runGenId = require("../extension/GeneratorID_v.1.2.js");

// const cors = require('cors');
// router.use(
//     cors({
//         origin: '*', // Укажите домен источника
//         methods: ['GET', 'POST'],
//         allowedHeaders: ['Content-Type'],
//     })
// );

// Маршрут для возврата HTML-формы
router.get('/', (req, res) => {
    const htmlForm = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File Upload</title>
        </head>
        <body>
            <h1>File Analyse Form</h1>
            <form action="https://${req.headers.host}/freeCodeCamp/analyse/api/fileanalyse" method="POST" enctype="multipart/form-data">
                <input type="file" name="upfile" />
                <button type="submit">Upload</button>
            </form>
        </body>
        </html>
    `;
    res.send(htmlForm);
});

// Мікросервіс метаданих файлу
router.use('/api/fileanalyse', upload.single('upfile'), (request, response) => {
    const operation_method = "POST";

    if (TEST) { 
        console.log('Request Body:', request.body);
        console.log('Request File:', request.file);
        console.log('Request Headers:', request.headers);
    };

    try {
        const valid = !request.file // !request.files or !request.files.upfile
        if (valid) {
            const code = 400
            return response.status(code).json(Object.assign({}, returns(code, null), { error: 'No file uploaded' }));
        } 
        if (!request.file) {
            const code = 400;
            return response.status(code).json({
                ...returns(code, null),
                error: 'No file uploaded',
            })
        }
        else if (request.method.toString().toUpperCase() === operation_method) {
            const { originalname, mimetype, size } = request.file;
            // const file = request.files.upfile; - // file.name, file.mimetype, file.size,
            const code = 200;
            const data = {
                id: runGenId(1, false, false, false),
                name: originalname, 
                type: mimetype,
                size: size,
            };
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


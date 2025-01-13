/* "MongoDB", v. 0.2 - 07.01.2025 | MIT License | Made by Anatolii Ovcharuk - https://github.com/Anatolii-Ovcharuk */
/* Description: This is a JS File for Node.js. */

    /* INSTALL */
/* Include code in your app: const mongoDB = require('./mongoDB_v.0.2.js'); */

    /* OPTIONS */
const CONNECTION_TYPE = runMongoose; // Set: runMongoose (Default and ready setting) | runMongoDB | runConnectionGoogleCloud
const CONNECT_MONGOOSE_OPT = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 секунд на выбор сервера
    socketTimeoutMS: 45000,         // 45 секунд на тайм-аут сокета
    // family: 4,                      // Принудительно использовать IPv4
};

    /* ███████████████████████████████████████████████ Includes ███████████████████████████████████████████████ */
    
    /* Mongoose */
require('colors');
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
    /* MongoDB */
const mongoDB = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
    /* Other */
// require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();
const { MONGO_DB_URL } = process.env;

    /* ███████████████████████████████████████████████ Configuration ███████████████████████████████████████████████ */
    
const TEST = false;

    /* ██████████████████████████████████████████ Validate after connect ██████████████████████████████████████████ */

if (!MONGO_DB_URL) {
    console.error("MongoDB connection URL is missing. Please check your environment variables or configuration.".red);
    // process.exit(1);
}

if (TEST) {
    mongoose.set('debug', true);
    // mongoose.set('debug', process.env.NODE_ENV === 'development');
};

mongoose.set('strictQuery', true);

    /* ████████████████████████████████████████████ Connect database ████████████████████████████████████████████ */
    
    /* Connect by MongoDB driver application */
function runMongoDB() {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(MONGO_DB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });
    
    async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        console.error("Error to connect MongoDB.".red);
        await client.close();
    }
    }

    run().catch(console.dir);
};

    /* Connect by Mongoose */
function runMongoose() {
    // mongoose.connect(MONGO_DB_URL)
    mongoose.connect(MONGO_DB_URL, CONNECT_MONGOOSE_OPT)
        .then(() => {
            console.log("Mongo-Database connect success".green);
        })
        .catch((error) => {
            console.error(`Mongo-Database connection failed. Error: ${error}`.red);
            // console.error(`Mongo-Database connect failed. ${error.message}`.red);
            // process.exit(1);
        });

    mongoose.connection.on('connecting', () => {
        console.log('Mongoose connecting to MongoDB...'.blue);
    });

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB successfully'.green);
    });

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err.message}`.red);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected'.yellow);
    });

    mongoose.connection.on('reconnected', () => {
        console.log('Mongoose reconnected to MongoDB.'.green);
    });
};

    /* Manage Connections with Google Cloud */
let client;
async function runConnectionGoogleCloud() {
    if (!client) {
      
        const client = new MongoClient(MONGO_DB_URL);
        client.on('connectionCreated', () => {
            console.log('New connection created successfully.');
        });
        // Connect to the database in the global scope
        await client.connect();
    }
    return client;
}

CONNECTION_TYPE();

    /* ████████████████████████████████████████ Default schema for Database ████████████████████████████████████████ */
    
    /* Schema - new mongoose.Schema / new Schema */
const schema = new Schema({
    id: {
        type: String,
        unique: false, // Уникальное поле
        required: true,
        // default: () => require('uuid').v4(), // Генерация уникального значения
    },
    number: {
        type: Number,
        required: true,
        default: false,
    },
    date: {
        type: String,
        required: true,
        default: false,
    },
    time: {
        type: String,
        match: /^\d{2}:\d{2}:\d{2}$/,
        required: true,
        default: false,
    },
    time_value: {
        type: Number,
        match: /^\d{13}$/,
        required: true,
        default: false,
    },
    // status: {
    //     type: String,
    //     enum: ["VIP", "FREE", "SUBMIT"],
    //     required: false,
    //     default: null, 
    // },
    data: {
        type: Schema.Types.Mixed, // String || Number || Object || Array,
        required: true,
        default: null,
    },
}, {
    versionKey: false,
    timestamps: true,
})

function getClusterModel(filename) {
    const schematic = schema;
    return mongoose.model(filename, schema); // Возвращаем модель с именем, зависящим от filename
}

// Модель користувача freeCodeCamp
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: false, // Уникальное поле
        required: true,
        // default: () => require('uuid').v4(), // Генерация уникального значения
    },
    username: { type: String, required: true },
});

// Модель вправи freeCodeCamp
const exerciseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: new Date() },
});

// Модель data freeCodeCamp
const dataSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    count: { type: Number, required: true },
    log: [exerciseSchema],
});

const cluster = model('Test', schema); // Export module
const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);
const TaskUser = mongoose.model('TaskUser', dataSchema);

    /* ████████████████████████████████████████ Exports modules ████████████████████████████████████████ */

module.exports = {
    cluster,
    getClusterModel,
    User,
    Exercise,
    TaskUser,
};

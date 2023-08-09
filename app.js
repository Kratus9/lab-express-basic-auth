// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// const session = require('express-session');
// const MongoStore = require('connect-mongo');

// const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/basic-auth";

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// // Configuración de la session
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET, // Palabra que cifra las cookies del usuario
//         resave: false, // No guarda sesión si no se modifica
//         saveUninitialized: false, // No crea sesión hasta que haya algo almacenado
//         cookie: {
//             maxAge: 1000 * 60 * 60 * 24 * 30 // Tiempo de vida en milisegundos de la cookie. (30 dias)
//         },
//         store: MongoStore.create({
//             mongoUrl: process.env.MONGO_URI
//         })
//     })
// )

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

const mainRouter = require('./routes/main');
app.use('/main', mainRouter);

const privateRouter = require('./routes/private');
app.use('/private', privateRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;


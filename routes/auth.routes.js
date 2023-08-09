const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const saltRounds = 10

// GET => Para renderizar la imagen del formulario para registrar un cliente
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs");
});

//POST => Para registrar en la DB la info que nos pasa el cliente
router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.render('auth/signup', { error: 'Todos los campos son necesarios!' });
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(password)) {
        res.render('auth/signup', { error: 'La contraseña debe contener minimo 6 caracteres, un numero, una letra minuscula y una letra mayuscula.' });
        return;
    }
    try {
        const userDB = await User.findOne({ username: username }); // Comprobamos si hay algun usuario con ese nombre en la DB
        if(userDB) {
            res.render('auth/signup', { error: 'El usuario ya existe. Por favor pruebe otro distinto' })
            return;
        } else { // En el caso de que el usuario introducido no exista en la DB, pasamos a codificar la contraseña y los creamos
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({ username, hashedPassword });
            res.render('auth/profile', newUser);
        }
    } catch (error) {
        next(error);
    }
})

// GET => Renderizamos vista para logearse
router.get('/login', (req, res, next) => {
    res.render('auth/login');
})

// POST => Pasamos formulario para que rellene el cliente y comprobamos autenticidad del cliente, antes de iniciar sesion
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.render('auth/login', { error: 'Introduce usuario y contraseña'});
        return;
    }
    try {
        const userDB = await User.findOne({username: username}) // Comprobamos si hay algun usuario con ese nombre en la DB
        if(!userDB) {
            res.render('auth/login', { error: `No hay ningun usuario llamado ${username}`});
            return;
        } else {
            const passwordMatch = await bcrypt.compare(password, userDB.hashedPassword);
            if(passwordMatch) { // Comprobamos si coincide la contraseña con la de la DB y de ser así, le renderizamos la vista de su perfil
                req.session.currentUser = userDB;
                res.render('auth/profile', userDB);
            } else {
                res.render('auth/login', { error: 'Imposible autentificar el usuario' });
                return;
            }
        }
    } catch (error) {
        next(error)
    }

})

module.exports = router;



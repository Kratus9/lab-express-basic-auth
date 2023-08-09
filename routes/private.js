const router = require("express").Router();
const isLoggedIn = require('../middlewares');

// GET => Renderizamos la pagina privada despues de comprobar si esta loggeado
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
const router = require("express").Router();
const isLoggedIn = require('../middlewares');

// GET => Renderizamos la pagina principal despues de comprobar si esta loggeado
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("main");
});

module.exports = router;
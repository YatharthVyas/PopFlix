const express = require("express");
const router = express.Router();
const flixControllers = require("../controllers/flix");

router.get("/home",flixControllers.getHome);




module.exports = router;
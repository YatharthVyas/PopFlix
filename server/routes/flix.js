const express = require("express");
const router = express.Router();
const flixcontrollers = require("../controllers/flix");

router.get("/home",flixcontrollers.getHome);




module.exports = router;
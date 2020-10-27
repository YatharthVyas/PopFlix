const express = require("express");
const router = express.Router();
const bookingcontrollers = require("../controllers/booking");

router.get("/book-flix",bookingcontrollers.getBookFlix);
router.get("/book-movie",bookingcontrollers.getMovieFlix);



module.exports = router;
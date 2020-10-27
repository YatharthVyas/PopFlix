const express = require("express");
const router = express.Router();
const bookingcontrollers = require("../controllers/booking");

router.get("/book-flix", bookingcontrollers.getBookFlix);
router.get("/book-movie", bookingcontrollers.getMovieFlix);
router.get("/select-movie", bookingcontrollers.getSelectMovieFlix);
router.get("/select-time", bookingcontrollers.getSelectTime);
router.get("/select-seat", bookingcontrollers.getSelectSeat);
router.get("/confirm-payment", bookingcontrollers.getConfirmPayment);


module.exports = router;
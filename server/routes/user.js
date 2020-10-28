const express = require('express');
const router = express.Router();
const bookingControllers = require('../controllers/booking');
const userControllers = require('../controllers/user');

router.get('/book-flix', bookingControllers.getBookFlix);
router.get('/book-movie', bookingControllers.getMovieFlix);
router.get('/select-movie', bookingControllers.getSelectMovie);
router.get('/select-flix', bookingControllers.getSelectFlix);
router.get('/select-time', bookingControllers.getSelectTime);
router.get('/select-seat', bookingControllers.getSelectSeat);
router.get('/confirm-payment', bookingControllers.getConfirmPayment);
router.get('/profile', userControllers.getProfile);

// Auth Routes
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;

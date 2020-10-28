const express = require('express');
const router = express.Router();
const bookingControllers = require('../controllers/booking');
const userControllers = require('../controllers/user');

router.get('/book_flix', bookingControllers.getBookFlix);
router.get('/book_movie', bookingControllers.getMovieFlix);
router.get('/select_movie', bookingControllers.getSelectMovie);
router.get('/select_flix', bookingControllers.getSelectFlix);
router.get('/select_time', bookingControllers.getSelectTime);
router.get('/select_seat', bookingControllers.getSelectSeat);
router.get('/confirm_payment', bookingControllers.getConfirmPayment);
router.get('/profile', userControllers.getProfile);

// Auth Routes
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;
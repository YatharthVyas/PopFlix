const express = require('express');
const router = express.Router();
const bookingControllers = require('../controllers/booking');
const userControllers = require('../controllers/user');

router.get('/book_flix', bookingControllers.getBookFlix);
router.post('/book_flix/search', bookingControllers.searchFlix);
router.get('/book_movie', bookingControllers.getMovieFlix);
router.post('/book_movie/search', bookingControllers.searchMovie);
router.get('/select_movie/:theaterId', bookingControllers.getSelectMovie);
router.get('/select_flix/:movieId', bookingControllers.getSelectFlix);
router.get(
  '/select_time',
  ensureAuthenticated,
  ensureCustomer,
  bookingControllers.getSelectTime
);
router.get(
  '/select_seat',
  ensureAuthenticated,
  ensureCustomer,
  bookingControllers.getSelectSeat
);
router.post(
  '/confirm_payment',
  ensureAuthenticated,
  ensureCustomer,
  bookingControllers.getConfirmPayment
);

router.get(
  '/profile',
  ensureAuthenticated,
  ensureCustomer,
  userControllers.getProfile
);

router.get('/logout', ensureAuthenticated, userControllers.logout);

// Auth Routes

router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);
router.post('/update', userControllers.updateProf);

async function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Please Log in',
    });
    return;
  }
}

async function ensureCustomer(req, res, next) {
  if (req.user.type === 'Customer') {
    return next();
  } else {
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Only Customers can access this page',
    });
  }
}

module.exports = router;

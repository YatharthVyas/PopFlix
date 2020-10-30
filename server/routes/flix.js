const express = require('express');
const router = express.Router();
const {
  getHome,
  getAboutUs,
  getFlixProfile,
  postAddShow,
} = require('../controllers/flix');

router.get('/home', getHome);
router.get('/aboutus', getAboutUs);
router.get('/profile', ensureAuthenticated, ensureTheater, getFlixProfile);
router.post('/add_show', ensureAuthenticated, ensureTheater, postAddShow);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Please Log in',
    });
  }
}

function ensureTheater(req, res, next) {
  if (req.user.type === 'Theater') {
    return next();
  } else {
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Only Theaters can access this page',
    });
  }
}

module.exports = router;

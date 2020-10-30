const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');

router.get('/home', ensureAuthenticated, isAdmin, adminControllers.getAdmin);
router.post('/movie', ensureAuthenticated, isAdmin, adminControllers.postMovie);
router.post(
  '/theater',
  ensureAuthenticated,
  isAdmin,
  adminControllers.postTheater
);

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

function isAdmin(req, res, next) {
  if (req.user.type !== 'Admin') {
    res.render('Error/error', {
      pg: 'Error',
      user: req.user,
      error: 'Only Admins Allowed to access this page',
    });
    return;
  } else {
    return next();
  }
}

module.exports = router;

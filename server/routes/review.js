const express = require('express');
const router = express.Router();
const {
  getMyReview,
  getParticularMovieReview,
} = require('../controllers/review');

router.get('/myReview', ensureAuthenticated, getMyReview);
router.get('/movieReview', getParticularMovieReview);
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
module.exports = router;

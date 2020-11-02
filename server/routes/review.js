const express = require("express");
const router = express.Router();
const {
  getMyReview,
  getParticularMovieReview,
  postReview,
} = require("../controllers/review");

// router.get("/myReview", ensureAuthenticated, getMyReview);
router.get("/movieReview/:movieId", getParticularMovieReview);
router.post("/movieReview/:movieId", ensureAuthenticated, postReview);
// router.post("/postReview/:movieId", ensureAuthenticated, postReview);
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render("Error/error", {
      pg: "error",
      user: req.user,
      error: "Please Log in",
    });
  }
}
module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getMyReview,
  getParticularMovieReview,
} = require("../controllers/review");

router.get("/myReview", getMyReview);
router.get("/movieReview", getParticularMovieReview);

module.exports = router;

const express = require("express");
const router = express.Router();
const bookingControllers = require("../controllers/booking");
const userControllers = require("../controllers/user");

router.get("/book_flix", bookingControllers.getBookFlix);
router.get("/book_movie", bookingControllers.getMovieFlix);
router.get("/select_movie/:theaterId", bookingControllers.getSelectMovie);
router.get("/select_flix/:movieId", bookingControllers.getSelectFlix);
router.get("/select_time", bookingControllers.getSelectTime);
router.get("/select_seat", bookingControllers.getSelectSeat);
router.get("/confirm_payment", bookingControllers.getConfirmPayment);
router.get(
  "/profile",
  ensureAuthenticated,
  ensureCustomer,
  userControllers.getProfile
);

// Auth Routes
router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.post("/update",userControllers.updateProf);
async function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render("Error/error", { pg: "error", error: "Please Log in" });
    return;
  }
}

async function ensureCustomer(req, res, next) {
  if (req.user.type === "Customer") {
    return next();
  } else {
    res.render("Error/error", {
      pg: "error",
      error: "Only Customers can access this page",
    });
  }
}

module.exports = router;

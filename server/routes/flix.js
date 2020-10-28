const express = require('express');
const router = express.Router();
const { getHome, getAboutUs, getFlixProfile } = require('../controllers/flix');

router.get('/home', getHome);
router.get('/aboutus', getAboutUs);
router.get('/profile', getFlixProfile);

module.exports = router;
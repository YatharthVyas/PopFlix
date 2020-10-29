const express = require('express');
const router = express.Router();
const { getHome, getAboutUs, getFlixProfile,postAddShow } = require('../controllers/flix');

router.get('/home', getHome);
router.get('/aboutus', getAboutUs);
router.get('/profile', getFlixProfile);
router.post('/add_show', postAddShow);


module.exports = router;
const express = require('express');
const router = express.Router();
const { getHome, getAboutUs } = require('../controllers/flix');

router.get('/home', getHome);
router.get('/aboutus', getAboutUs);

module.exports = router;

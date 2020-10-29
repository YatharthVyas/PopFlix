const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');


router.get('/home', adminControllers.getAdmin);
router.post('/movie',adminControllers.postMovie);
router.post('/theater',adminControllers.postTheater);
module.exports = router;
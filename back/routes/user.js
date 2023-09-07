const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const { limiter100Per15min, limiter50Per15min } = require('../middlewares/apiLimiter');
const inputLimiter = require('../middlewares/inputLimiter');

router.post('/signup',limiter50Per15min, inputLimiter(100), userCtrl.signup);
router.post('/login',limiter100Per15min, inputLimiter(100), userCtrl.login);  

module.exports = router;
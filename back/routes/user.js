const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const { limiter100, limiter50 } = require('../middlewares/apiLimiter');

router.post('/signup', (req, res, next) => {
    console.log('Signup route atteinte');
    next();
}, limiter50, userCtrl.signup);
router.post('/login',limiter100, userCtrl.login);  

module.exports = router;
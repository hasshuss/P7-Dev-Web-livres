const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const checkAuth = require('../middlewares/checkAuth');
const { limiter5PerMin, limiter50Per15min } = require('../middlewares/apiLimiter');
const inputLimiter = require('../middlewares/inputLimiter');



router.post('/',limiter50Per15min, inputLimiter(100), checkAuth,  bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating',bookCtrl.getBestRating);
router.put('/:id', limiter50Per15min, inputLimiter(100), checkAuth,  bookCtrl.modifyBook);
router.get('/:id', bookCtrl.getOneBook);   
router.delete('/:id' ,limiter50Per15min, checkAuth, bookCtrl.DeleteBook);
router.post('/:id/rating',limiter50Per15min, checkAuth,  bookCtrl.rateBook);

module.exports = router;
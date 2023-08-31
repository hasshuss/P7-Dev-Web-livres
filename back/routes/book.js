const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const checkAuth = require('../middlewares/checkAuth');

router.post('/',checkAuth, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating',bookCtrl.getBestRating);
router.put('/:id', checkAuth, bookCtrl.modifyBook);
router.get('/:id', bookCtrl.getOneBook);   
router.delete('/:id' ,checkAuth, bookCtrl.DeleteBook);
router.post('/:id/rating', checkAuth,bookCtrl.rateBook);

module.exports = router;
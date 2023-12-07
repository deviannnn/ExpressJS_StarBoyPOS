var express = require('express');
var router = express.Router();

const productController = require('../controllers/product');
const { validate, checkProduct, checkUProduct } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

const title = 'Products';

router.use(authenticate);

router.get('/', function (req, res, next) {
  res.render('product', { title: title, subTitle: 'Product List' });
});

router.use(isAdmin);

router.get('/handle', productController.goHandleView);

router.post('/getAll', productController.getAll);

router.post('/get', productController.getByID);

router.post('/create', [checkProduct, validate], productController.create);

router.put('/update', [checkUProduct, validate], productController.update);

router.delete('/remove', productController.remove);

module.exports = router;
var express = require('express');
var router = express.Router();

const productController = require('../controllers/product');
const { validate, checkProduct, checkUProduct } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

const title = 'Products';

router.get('/handle', productController.goHandleView);

router.get('/', function (req, res, next) {
  res.render('product', { title: title, subTitle: 'Product List' });
});

// router.use(authenticate);
// router.use(isAdmin);

router.post('/getAll', productController.getAll);

router.post('/get', [checkUProduct, validate], productController.getByID);

router.post('/create', [checkProduct, validate], productController.create);

router.put('/update', [checkUProduct, validate], productController.update);

router.delete('/remove', [checkUProduct, validate], productController.remove);

module.exports = router;
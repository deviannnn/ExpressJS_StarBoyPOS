var express = require('express');
var router = express.Router();

const productController = require('../controllers/product');
const { validate, checkProduct, checkUProduct } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/auth');

router.get('/', productController.renderProductList);

router.post('/getAll', productController.getAll);

router.post('/get', productController.getByID);

router.use(isAdmin);

router.get('/handle', productController.renderHandleView);

router.post('/create', [checkProduct, validate], productController.create);

router.put('/update', [checkUProduct, validate], productController.update);

router.delete('/remove', productController.remove);

module.exports = router;
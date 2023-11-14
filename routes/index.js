var express = require('express');
var router = express.Router();

const specsRouter = require('./routes/specs');
const themeRouter = require('./routes/theme');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const purchaseRouter = require('./routes/purchase');
const accountRouter = require('./routes/account');
const supplierRouter = require('./routes/supplier');
const customerRouter = require('./routes/customer');

router.use('/specs', specsRouter);
router.use('/theme', themeRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/purchase', purchaseRouter);
router.use('/account', accountRouter);
router.use('/supplier', supplierRouter);
router.use('/customer', customerRouter);

module.exports = router;
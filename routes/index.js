var express = require('express');
var router = express.Router();

router.get('/home', (req, res) => {
    res.render('index')
})

router.get('/pos', (req, res) => {
    res.render('pos', { layout: null, tittle: 'POS' })
})

const customerRouter = require('./customer');
const accountRouter = require('./account');
const categoryRouter = require('./category');
const productRouter = require('./product');
const variantRouter = require('./variant');
const purchaseRouter = require('./purchase');
const supplierRouter = require('./supplier');

router.use('/account', accountRouter);
router.use('/customer', customerRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/variant', variantRouter);
router.use('/purchase', purchaseRouter);
router.use('/supplier', supplierRouter);

module.exports = router;
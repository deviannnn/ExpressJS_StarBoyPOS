var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/pos', (req, res) => {
    res.render('pos', { layout: null, tittle: 'POS' })
})

const specsRouter = require('./specs');
const themeRouter = require('./theme');
const categoryRouter = require('./category');
const productRouter = require('./product');
const purchaseRouter = require('./purchase');
const accountRouter = require('./account');
const supplierRouter = require('./supplier');
const customerRouter = require('./customer');

router.use('/specs', specsRouter);
router.use('/theme', themeRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/purchase', purchaseRouter);
router.use('/account', accountRouter);
router.use('/supplier', supplierRouter);
router.use('/customer', customerRouter);

module.exports = router;
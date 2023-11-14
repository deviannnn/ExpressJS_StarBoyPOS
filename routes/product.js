var express = require('express');
var router = express.Router();

const tittle = 'Products';

router.get('/', function(req, res, next) {
  res.render('product', { tittle: tittle, subTittle: 'Product List'} );
});

router.get('/add', function(req, res, next) {
  res.render('product-add', { tittle: tittle, subTittle: 'New Product'});
});

module.exports = router;
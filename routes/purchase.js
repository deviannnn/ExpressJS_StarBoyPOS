var express = require('express');
var router = express.Router();

const tittle = 'Purchases';

router.get('/', function(req, res, next) {
  res.render('purchase', { tittle: tittle, subTittle: 'Purchase List'} );
});

router.get('/add', function(req, res, next) {
  res.render('purchase-add', { tittle: tittle, subTittle: 'New Purchase'});
});

module.exports = router;
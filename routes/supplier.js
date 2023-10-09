var express = require('express');
var router = express.Router();

const tittle = 'Suppliers';

router.get('/', function(req, res, next) {
  res.render('supplier', { tittle: tittle, subTittle: 'Supplier List'} );
});

router.get('/add', function(req, res, next) {
  res.render('supplier-add', { tittle: tittle, subTittle: 'New Supplier'});
});

module.exports = router;

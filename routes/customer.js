var express = require('express');
var router = express.Router();

const tittle = 'Customers';

router.get('/', function(req, res, next) {
  res.render('customer', { tittle: tittle, subTittle: 'Customer List'} );
});

router.get('/add', function(req, res, next) {
  res.render('customer-add', { tittle: tittle, subTittle: 'New Customer'});
});

module.exports = router;
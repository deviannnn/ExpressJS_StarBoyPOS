var express = require('express');
var router = express.Router();

const title = 'Customers';

router.get('/', function(req, res, next) {
  res.render('customer', { title: title, subTitle: 'Customer List'} );
});

router.get('/add', function(req, res, next) {
  res.render('customer-add', { title: title, subTitle: 'New Customer'});
});

module.exports = router;
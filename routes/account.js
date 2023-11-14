var express = require('express');
var router = express.Router();

const tittle = 'Accounts';

router.get('/', function(req, res, next) {
  res.render('account', { tittle: tittle, subTittle: 'Account List'} );
});

router.get('/add', function(req, res, next) {
  res.render('account-add', { tittle: tittle, subTittle: 'New Account'});
});

router.get('/profile', function(req, res, next) {
  res.render('account-profile', { tittle: "Profile", subTittle: 'Profile'});
});

module.exports = router;
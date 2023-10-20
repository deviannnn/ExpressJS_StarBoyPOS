var express = require('express');
var router = express.Router();

const tittle = 'Specs';

router.get('/', function(req, res, next) {
  res.render('spec', { tittle: tittle, subTittle: 'Specs List'} );
});

router.get('/add', function(req, res, next) {
  res.render('spec-add', { tittle: tittle, subTittle: 'New Specs'});
});

module.exports = router;

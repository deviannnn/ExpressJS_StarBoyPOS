var express = require('express');
var router = express.Router();

const tittle = 'Categories';

router.get('/', function(req, res, next) {
  res.render('category', { tittle: tittle, subTittle: 'Category List'} );
});

router.get('/add', function(req, res, next) {
  res.render('category-add', { tittle: tittle, subTittle: 'New Category'});
});

module.exports = router;
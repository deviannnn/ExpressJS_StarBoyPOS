var express = require('express');
var router = express.Router();

const tittle = 'Themes';

router.get('/', function(req, res, next) {
  res.render('theme', { tittle: tittle, subTittle: 'Theme List'} );
});

router.get('/add', function(req, res, next) {
  res.render('theme-add', { tittle: tittle, subTittle: 'New Theme'});
});

module.exports = router;
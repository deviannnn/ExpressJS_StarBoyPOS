var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account');
const { validate, checkRegister } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

const tittle = 'Accounts';

router.post('/login', accountController.login);

router.use(authenticate, isAdmin);

router.get('/', function (req, res, next) {
  res.render('account', { tittle: tittle, subTittle: 'Account List' });
});

router.get('/add', function (req, res, next) {
  res.render('account-add', { tittle: tittle, subTittle: 'New Account' });
});

router.get('/profile', function (req, res, next) {
  res.render('account-profile', { tittle: "Profile", subTittle: 'Profile' });
});

router.post('/register', [checkRegister, validate], accountController.register);

router.post('/get', accountController.get);

router.post('/getAll', accountController.getAll);

router.put('/update', accountController.update);

router.delete('/remove', accountController.remove);

module.exports = router;
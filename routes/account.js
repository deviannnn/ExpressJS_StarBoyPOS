var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account');
const { validate, checkRegister, checkUAccount } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

const title = 'Accounts';

router.post('/login', accountController.login);

// router.use(authenticate);

router.get('/profile', function (req, res) {
  res.render('account-profile', { title: "Profile", subTitle: 'Profile' });
});

// router.use(isAdmin);

router.get('/', function (req, res) {
  res.render('account', { title: title, subTitle: 'Account List' });
});

router.get('/add', function (req, res) {
  res.render('account-add', { title: title, subTitle: 'New Account' });
});

router.post('/register', [checkRegister, validate], accountController.register);

router.post('/get', accountController.getByID);

router.post('/getAll', accountController.getAll);

router.put('/update', [checkUAccount, validate], accountController.update);

router.delete('/remove', accountController.remove);

module.exports = router;
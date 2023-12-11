var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account');
const upload = require('../utils/upload-image');
const { validate, checkRegister, checkUAccount } = require('../middlewares/validate');
const { authenticate, isLoggedIn, isAdmin } = require('../middlewares/auth');

const title = 'Accounts';

router.get('/login', function (req, res) {
  res.render('account_login', { layout: 'pre_layout', script: 'account_login' });
});

router.post('/login', accountController.login);

router.get('/password/reset', function (req, res) {
  res.render('account_password_reset', { layout: 'pre_layout', script: 'account_password_reset' });
});

router.post('/password/reset', accountController.passwordReset);

router.use(authenticate);

router.get('/password/change', function (req, res) {
  res.render('account_password_change', { layout: 'pre_layout', user: req.user, script: 'account_password_change' });
});

router.post('/password/change', accountController.passwordChange);

router.use(isLoggedIn);

router.get('/profile', function (req, res) {
  res.render('account_profile', { title: "Profile", subTitle: 'Profile' });
});

router.use(isAdmin);

router.get('/', function (req, res) {
  res.render('account_list', { title: title, subTitle: 'Account List', script: 'account' });
});

router.get('/register', function (req, res) {
  res.render('account_register', { title: title, subTitle: 'New Account', script: 'account_register' });
});

router.post('/register', [checkRegister, validate], accountController.register);

router.post('/get', accountController.getByID);

router.post('/getAll', accountController.getAll);

const setRootFolder = (req, res, next) => {
  req.root = {};
  req.root.folder = 'account';
  next();
}

router.put('/update', [checkUAccount, validate], setRootFolder, upload.single('avatar'), accountController.update);

router.delete('/remove', accountController.remove);

module.exports = router;
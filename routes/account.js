var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account');
const upload = require('../utils/upload-image');
const { validate, checkRegister, checkUAccount } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

const title = 'Accounts';

router.post('/login', accountController.login);


router.get('/profile', function (req, res) {
  res.render('account-profile', { title: "Profile", subTitle: 'Profile' });
});


router.get('/', function (req, res) {
  res.render('account', { title: title, subTitle: 'Account List', script: 'account.render.js' });
});

router.get('/register', function (req, res) {
  res.render('account-register', { title: title, subTitle: 'New Account', script: 'account-register.render.js' });
});

// router.use(authenticate);

// router.use(isAdmin);

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
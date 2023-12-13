var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account');
const upload = require('../utils/upload-image');
const { validate, checkRegister, checkUAccount } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/auth');

const title = 'Accounts';

router.get('/profile', accountController.renderProfile);

router.post('/password/update', accountController.passwordUpdate);

router.use(isAdmin);

router.get('/', function (req, res) {
  res.render('account_list', { title: title, subTitle: 'Account List', script: 'account' });
});

router.get('/register', function (req, res) {
  res.render('account_register', { title: title, subTitle: 'New Account', script: 'account_register' });
});

router.post('/register', [checkRegister, validate], accountController.register);

router.post('/resendMail', accountController.resendMail);

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
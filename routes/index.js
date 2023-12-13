var express = require('express');
var router = express.Router();
const { loginLimiter, passwordResetLimiter } = require('../configs/ratelimit')

const accountController = require('../controllers/account');
const { authenticate, checkRevokedToken, isPasswordChange, isLoggedIn } = require('../middlewares/auth');

router.get('/login', function (req, res) {
    res.render('login', { layout: 'pre_layout', script: 'account_login' });
});

router.post('/login', loginLimiter, accountController.login);

router.get('/password/reset', function (req, res) {
    res.render('password_reset', { layout: 'pre_layout', script: 'account_password_reset' });
});

router.post('/password/reset', passwordResetLimiter, accountController.passwordReset);

router.use(authenticate);

router.get('/password/change', isPasswordChange, function (req, res) {
    res.render('password_change', { layout: 'pre_layout', user: req.user, script: 'account_password_change' });
});

router.post('/password/change', isPasswordChange, accountController.passwordChange);

router.use(checkRevokedToken, isLoggedIn);

router.post('/logout', accountController.logout);

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.hello = req.session.hello;
    delete req.session.hello;
    next();
});

router.get('/', (req, res) => { res.render('index') })

router.get('/pos', (req, res) => { res.render('pos', { layout: null, tittle: 'POS' }) })

const customerRouter = require('./customer');
const accountRouter = require('./account');
const categoryRouter = require('./category');
const productRouter = require('./product');
const variantRouter = require('./variant');
const purchaseRouter = require('./purchase');
const supplierRouter = require('./supplier');

router.use('/account', accountRouter);
router.use('/customer', customerRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/variant', variantRouter);
router.use('/purchase', purchaseRouter);
router.use('/supplier', supplierRouter);

module.exports = router;
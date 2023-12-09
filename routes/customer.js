var express = require('express');
var router = express.Router();

const customerController = require('../controllers/customer');
const { validate, checkCustomer, checkUCustomer } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

const title = 'Customers';

router.get('/', function(req, res, next) {
  res.render('customer', { title: title, subTitle: 'Customer List'} );
});

router.get('/register', function(req, res, next) {
  res.render('customer-register', { title: title, subTitle: 'New Customer'});
});

// router.use(authenticate);

router.post('/register', [checkCustomer, validate], customerController.register);

router.post('/get', customerController.getByID);

router.post('/getAll', customerController.getAll);

router.put('/update', [checkUCustomer, validate], customerController.update);

// router.use(isAdmin);

router.delete('/remove', customerController.remove);

module.exports = router;
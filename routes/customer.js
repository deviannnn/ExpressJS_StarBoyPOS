var express = require('express');
var router = express.Router();

const customerController = require('../controllers/customer');
const { validate, checkCustomer, checkUCustomer } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/auth');

const title = 'Customers';

router.get('/', customerController.renderCustomerList);

router.get('/register', function (req, res) {
  res.render('customer_register', { title: title, subTitle: 'New Customer', script: 'customer_register' });
});

router.post('/register', [checkCustomer, validate], customerController.register);

router.post('/get', customerController.getByID);

router.post('/getAll', customerController.getAll);

router.put('/update', [checkUCustomer, validate], customerController.update);

router.post('/search', customerController.search);

router.use(isAdmin);

router.delete('/remove', customerController.remove);

module.exports = router;
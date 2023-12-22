var express = require('express');
var router = express.Router();

const orderController = require('../controllers/order');
const { validate, checkOrder, checkTimeFrame } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/auth');

router.get('/invoice/:orderId', orderController.renderInvoice);

router.post('/getByTimeFrame', [checkTimeFrame, validate], orderController.getByTimeFrame);

router.post('/get', orderController.get);

router.post('/create', [checkOrder, validate], orderController.create);

router.use(isAdmin);

router.put('/update', orderController.update);

router.delete('/remove', orderController.remove);

module.exports = router;
var express = require('express');
var router = express.Router();

const variantController = require('../controllers/variant');
const upload = require('../utils/upload-image');
const { validate, checkVariant, checkUVariant } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.use(authenticate);

router.use(isAdmin);

router.post('/getAllByProduct', [checkUVariant, validate], variantController.getAllByProductID);

router.post('/getByBarcode', variantController.getByBarcode);

router.post('/create', upload.single('img'), [checkVariant, validate], variantController.create);

router.put('/update', upload.single('img'), [checkUVariant, validate], variantController.update);

router.delete('/remove', variantController.remove);

module.exports = router;
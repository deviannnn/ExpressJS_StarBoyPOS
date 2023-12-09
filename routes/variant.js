var express = require('express');
var router = express.Router();

const variantController = require('../controllers/variant');
const upload = require('../utils/upload-image');
const { validate, checkVariant, checkUVariant } = require('../middlewares/validate');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.use(authenticate);

router.use(isAdmin);

router.post('/getAllByProduct', variantController.getAllByProductID);

router.post('/getByBarcode', variantController.getByBarcode);

const setRootFolder = (req, res, next) => {
    req.root = {};
    req.root.folder = 'product_variants';
    next();
}

router.post('/create', [checkVariant, validate], setRootFolder, upload.single('img'), variantController.create);

router.put('/update', [checkUVariant, validate], setRootFolder, upload.single('img'), variantController.update);

router.delete('/remove', variantController.remove);

module.exports = router;
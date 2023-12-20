var express = require('express');
var router = express.Router();

const variantController = require('../controllers/variant');
const upload = require('../utils/upload-image');
const { validate, checkVariant, checkUVariant } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/auth');

router.post('/getAllByProduct', variantController.getAllByProductID);

router.post('/getByBarcode', variantController.getByBarcode);

router.post('/search', variantController.search);

router.use(isAdmin);

const setRootFolder = (req, res, next) => {
    req.root = {};
    req.root.folder = 'product_variants';
    next();
}

router.post('/uploadImg', setRootFolder, upload.single('img'), variantController.uploadImg);

router.post('/create', [checkVariant, validate], variantController.create);

router.put('/update', [checkUVariant, validate], variantController.update);

router.delete('/remove', variantController.remove);

module.exports = router;
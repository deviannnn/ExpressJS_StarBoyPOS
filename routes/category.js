var express = require('express');
var router = express.Router();

const categoryController = require('../controllers/category');
const { validate, checkNameCategory, checkSpecsCategory } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/auth');

router.get('/', categoryController.renderCategoryList);

router.post('/getAll', categoryController.getAll);

router.post('/get', categoryController.getByID);

router.post('/getSpec', categoryController.getSpec);

router.use(isAdmin);

router.get('/handle', categoryController.renderHandleView);

router.post('/create', [checkNameCategory, validate], categoryController.create);

router.put('/updateName', [checkNameCategory, validate], categoryController.updateName);

router.post('/addSpecs', [checkSpecsCategory, validate], categoryController.addSpecs);

router.put('/updateSpecs', [checkSpecsCategory, validate], categoryController.updateSpecs);

router.delete('/removeSpecs', categoryController.removeSpecs);

router.delete('/remove', categoryController.remove);

module.exports = router;
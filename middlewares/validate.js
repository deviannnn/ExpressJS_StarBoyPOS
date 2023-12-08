const { validationResult, check } = require('express-validator');
const Account = require('../models/account');
const Variant = require('../models/variant');

const checkRegister = [
    check('email')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const existingAccount = await Account.findOne({ email: value });
            if (existingAccount) {
                throw new Error('Email already exists.');
            }
        }),

    check('name')
        .not().isEmpty().withMessage('Fullname cannot be empty.')
        .matches(/^[\p{L}\s]*$/u).withMessage('Fullname should only contain letters and spaces.'),

    check('gender')
        .not().isEmpty().withMessage('Gender cannot be empty.')
        .isIn(['male', 'female']).withMessage('Invalid gender value.'),

    check('birthday')
        .not().isEmpty().withMessage('Birthday cannot be empty.')
        .custom((value) => {
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new Error('Invalid date format. Please use yyyy-mm-dd.');
            }
            return true;
        }),

    check('phone')
        .not().isEmpty().withMessage('Phone cannot be empty.')
        .isNumeric().withMessage('Phone must contain only numbers.')
        .isLength({ min: 10, max: 11 }).withMessage('Phone must be 10 or 11 digits long.')
        .custom(async (value) => {
            const existingAccount = await Account.findOne({ 'profile.phone': value });
            if (existingAccount) {
                throw new Error('Phone number already exists.');
            }
        }),

    check('num')
        .not().isEmpty().withMessage('Address number cannot be empty.')
        .isString().withMessage('Invalid address number value.'),

    check('street')
        .not().isEmpty().withMessage('Street cannot be empty.')
        .isString().withMessage('Invalid street value'),

    check('ward')
        .not().isEmpty().withMessage('Ward cannot be empty.')
        .isString().withMessage('Invalid ward value.'),

    check('district')
        .not().isEmpty().withMessage('District cannot be empty.')
        .isString().withMessage('Invalid district value.'),

    check('city')
        .not().isEmpty().withMessage('City cannot be empty.')
        .isString().withMessage('Invalid city value.'),
];

const checkUAccount = [
    check('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .custom(async (value, { req }) => {
            if (value) {
                const existingAccount = await Account.findOne({ email: value, Id: { $ne: req.body.Id } });
                if (existingAccount) {
                    throw new Error('Email already exists.');
                }
            }
        }),

    check('name')
        .optional()
        .not().isEmpty().withMessage('Fullname cannot be empty.')
        .matches(/^[\p{L}\s]*$/u).withMessage('Fullname should only contain letters and spaces.'),

    check('gender')
        .optional()
        .not().isEmpty().withMessage('Gender cannot be empty.')
        .isIn(['male', 'female']).withMessage('Invalid gender value.'),

    check('birthday')
        .optional()
        .not().isEmpty().withMessage('Birthday cannot be empty.')
        .custom((value) => {
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new Error('Invalid date format. Please use yyyy-mm-dd.');
            }
            return true;
        }),

    check('phone')
        .optional()
        .not().isEmpty().withMessage('Phone cannot be empty.')
        .isNumeric().withMessage('Phone must contain only numbers.')
        .isLength({ min: 10, max: 11 }).withMessage('Phone must be 10 or 11 digits long.')
        .custom(async (value, { req }) => {
            if (value) {
                const existingAccount = await Account.findOne({ 'profile.phone': value, Id: { $ne: req.body.Id } });
                if (existingAccount) {
                    throw new Error('Phone number already exists.');
                }
            }
        }),

    check('num')
        .optional()
        .not().isEmpty().withMessage('Address number cannot be empty.')
        .isString().withMessage('Invalid address number value.'),

    check('street')
        .optional()
        .not().isEmpty().withMessage('Street cannot be empty.')
        .isString().withMessage('Invalid street value'),

    check('ward')
        .optional()
        .not().isEmpty().withMessage('Ward cannot be empty.')
        .isString().withMessage('Invalid ward value.'),

    check('district')
        .optional()
        .not().isEmpty().withMessage('District cannot be empty.')
        .isString().withMessage('Invalid district value.'),

    check('city')
        .optional()
        .not().isEmpty().withMessage('City cannot be empty.')
        .isString().withMessage('Invalid city value.'),

    check('role')
        .optional()
        .isIn(['admin', 'staff']).withMessage('Invalid role value. Role should be \'admin\' or \'staff\''),

    check('locked')
        .optional()
        .isBoolean().withMessage('Invalid locked value.')
];

const checkNameCategory = [
    check('name')
        .not().isEmpty().withMessage('Category\'s name cannot be empty.')
        .matches(/^[\p{L}\s]*$/u).withMessage('Category\'s name should only contain letters and spaces.'),
];

const checkSpecsCategory = [
    check('categoryId')
        .not().isEmpty().withMessage('Category cannot be empty.')
        .isMongoId().withMessage('Invalid category ID.'),

    check('name')
        .not().isEmpty().withMessage('Specification\'s name cannot be empty.')
        .matches(/^[\p{L}\s]*$/u).withMessage('Specification\'s name should only contain letters and spaces.'),

    check('options')
        .isArray().withMessage('Invalid options array.')
        .custom((options, { req }) => {
            if (options.length === 0) {
                throw new Error('Options array should not be empty.');
            }

            options.forEach((option, index) => {
                if (!option || typeof option !== 'string' || option.trim() === '') {
                    throw new Error(`Invalid option at index ${index}. Options should be strings.`);
                }
            });

            return true;
        })
];

const checkProduct = [
    check('categoryId')
        .not().isEmpty().withMessage('Category cannot be empty.')
        .isMongoId().withMessage('Invalid category ID.'),

    check('name')
        .not().isEmpty().withMessage('Product\'s name cannot be empty.')
        .isString().withMessage('Product\'s color must be a string.'),

    check('specs')
        .optional()
        .isArray().withMessage('Invalid specifications.')
        .custom((specs, { req }) => {
            if (!Array.isArray(specs) || specs.length === 0) {
                throw new Error('Specifications are required.');
            }

            specs.forEach((spec, index) => {
                if (!spec.name || typeof spec.name !== 'string' || !/^[\p{L}\s]+$/u.test(spec.name.trim())) {
                    throw new Error('Invalid specification name format. It should only contain letters and spaces.');
                }

                if (!spec.option || typeof spec.option !== 'string' || spec.option.trim() === '') {
                    throw new Error(`Invalid option at index ${index}. Options should be strings.`);
                }
            });

            return true;
        }),
];

const checkUProduct = [
    check('productId')
        .optional()
        .not().isEmpty().withMessage('Product ID cannot be empty.')
        .isMongoId().withMessage('Invalid product ID.'),

    check('categoryId')
        .optional()
        .not().isEmpty().withMessage('Category ID cannot be empty.')
        .isMongoId().withMessage('Invalid category ID.'),

    check('name')
        .optional()
        .not().isEmpty().withMessage('Product\'s name cannot be empty.')
        .isString().withMessage('Product\'s color must be a string.'),

    check('specs')
        .optional()
        .isArray().withMessage('Invalid specifications.')
        .custom((specs, { req }) => {
            if (!Array.isArray(specs) || specs.length === 0) {
                throw new Error('Specifications are required.');
            }

            specs.forEach((spec, index) => {
                if (!spec.name || typeof spec.name !== 'string' || !/^[\p{L}\s]+$/u.test(spec.name.trim())) {
                    throw new Error('Invalid specification name format. It should only contain letters and spaces.');
                }

                if (!spec.option || typeof spec.option !== 'string' || spec.option.trim() === '') {
                    throw new Error(`Invalid option at index ${index}. Options should be strings.`);
                }
            });

            return true;
        }),

    check('actived')
        .optional()
        .isBoolean().withMessage('Invalid actived value.')
];

const checkVariant = [
    check('productId')
        .not().isEmpty().withMessage('Product cannot be empty.')
        .isMongoId().withMessage('Invalid product ID.'),

    check('barcode')
        .not().isEmpty().withMessage('Barcode cannot be empty.')
        .isString().withMessage('Barcode must be a string.')
        .custom(async (value) => {
            if (value) {
                const existingVariant = await Variant.findOne({ barcode: value });
                if (existingVariant) {
                    throw new Error('Barcode already exists.');
                }
            }
        }),

    check('color')
        .not().isEmpty().withMessage('Product Variant\'s color cannot be empty.')
        .isString().withMessage('Product Variant\'s color must be a string.'),

    check('cost')
        .not().isEmpty().withMessage('Cost cannot be empty.')
        .isNumeric().withMessage('Cost must be a number.'),

    check('price')
        .not().isEmpty().withMessage('Price cannot be empty.')
        .isNumeric().withMessage('Price must be a number.'),

    check('warn')
        .not().isEmpty().withMessage('Warn cannot be empty.')
        .isNumeric().withMessage('Warn must be a number.')
];

const checkUVariant = [
    check('productId')
        .optional()
        .not().isEmpty().withMessage('Product cannot be empty.')
        .isMongoId().withMessage('Invalid product ID.'),

    check('newbarcode')
        .optional()
        .not().isEmpty().withMessage('Barcode cannot be empty.')
        .custom(async (value, { req }) => {
            if (value === req.body.barcode) return true;
            if (value) {
                const existingVariant = await Variant.findOne({ barcode: value });
                if (existingVariant) {
                    throw new Error('Barcode already exists.');
                }
            }
            return true
        }),

    check('color')
        .optional()
        .not().isEmpty().withMessage('Product Variant\'s color cannot be empty.'),

    check('cost')
        .optional()
        .not().isEmpty().withMessage('Cost cannot be empty.')
        .isNumeric().withMessage('Cost must be a number.'),

    check('price')
        .optional()
        .not().isEmpty().withMessage('Price cannot be empty.')
        .isNumeric().withMessage('Price must be a number.'),

    check('warn')
        .optional()
        .not().isEmpty().withMessage('Warn cannot be empty.')
        .isNumeric().withMessage('Warn must be a number.'),

    check('actived')
        .optional()
        .isBoolean().withMessage('Invalid actived value.')
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({ field: error.path, msg: error.msg }));
        return res.status(400).json({ success: false, type: 0, errors: errorMessages });
    }
    next();
}

module.exports = {
    validate, checkRegister, checkUAccount, checkNameCategory, checkSpecsCategory, checkProduct,
    checkUProduct, checkVariant, checkUVariant
};
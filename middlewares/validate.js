const { validationResult, check } = require('express-validator');
const Account = require('../models/account');

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
        .not().isEmpty().withMessage('Gender cannot be empty.'),

    check('birthday')
        .not().isEmpty().withMessage('Birthday cannot be empty.'),

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

    check('address.num')
        .not().isEmpty().withMessage('Address number cannot be empty.'),

    check('address.street')
        .not().isEmpty().withMessage('Street cannot be empty.'),

    check('address.ward')
        .not().isEmpty().withMessage('Ward cannot be empty.'),

    check('address.district')
        .not().isEmpty().withMessage('District cannot be empty.'),

    check('address.city')
        .not().isEmpty().withMessage('City cannot be empty.'),
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({ field: error.path, msg: error.msg }));
        return res.status(400).json({ success: false, errors: errorMessages });
    }
    next();
}

module.exports = { validate, checkRegister };
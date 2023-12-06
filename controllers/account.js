const Account = require('../models/account');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../utils/jwt');
const { generateId } = require('../utils/auto-id');

const register = async (req, res) => {
    const { email, name, gender, birthday, phone, num, street, ward, district, city } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(email.split('@')[0], 10);

        const newAccount = new Account({
            Id: generateId('STF'),
            email: email,
            password: hashedPassword,
            profile: {
                name: name,
                gender: gender,
                birthday: birthday,
                phone: phone,
                address: { num: num, street: street, ward: ward, district: district, city: city },
                avatar: 'default.png'
            },
            created: {
                Id: req.user.Id,
                name: req.user.name
            }
        });

        await newAccount.save();

        return res.status(201).json({ success: true, message: 'Account registered successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ email: `${username}@gmail.com` });

        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = await generateJWT(account);

        return res.status(200).json({ success: true, message: 'Login successful.', token: token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAll = async (req, res) => {
    try {
        const accounts = await Account.find();

        res.status(200).json({ success: true, accounts: accounts });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getByID = async (req, res) => {
    const { Id } = req.body;

    try {
        const existingAccount = await Account.findOne({ Id });
        if (!existingAccount) {
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        return res.status(200).json({ success: true, account: existingAccount });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const update = async (req, res) => {
    const { Id, email, name, gender, birthday, phone, num, street, ward, district, city, role, locked } = req.body;

    try {
        const existingAccount = await Account.findOne({ Id });
        if (!existingAccount) {
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        if (shouldSkipUpdate({ email, name, gender, birthday, phone, num, street, ward, district, city, role, locked }, existingAccount)) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        const replaceUndefined = (value, defaultValue) => (value !== undefined ? value : defaultValue);

        const updatedAccount = await Account.findOneAndUpdate(
            { Id },
            {
                $addToSet: {
                    updated: {
                        Id: req.user.Id,
                        name: req.user.name,
                        datetime: Date.now(),
                    }
                },
                $set: {
                    email: replaceUndefined(email, existingAccount.email),
                    profile: {
                        name: replaceUndefined(name, existingAccount.profile.name),
                        gender: replaceUndefined(gender, existingAccount.profile.gender),
                        birthday: replaceUndefined(birthday, existingAccount.profile.birthday),
                        phone: replaceUndefined(phone, existingAccount.profile.phone),
                        address: {
                            num: replaceUndefined(num, existingAccount.profile.address.num),
                            street: replaceUndefined(street, existingAccount.profile.address.street),
                            ward: replaceUndefined(ward, existingAccount.profile.address.ward),
                            district: replaceUndefined(district, existingAccount.profile.address.district),
                            city: replaceUndefined(city, existingAccount.profile.address.city)
                        },
                    },
                    role: replaceUndefined(role, existingAccount.role),
                    locked: replaceUndefined(locked, existingAccount.locked)
                }
            },
            { new: true }
        );

        return res.status(200).json({ success: true, account: updatedAccount });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    const { Id } = req.body;

    try {
        const deletedAccount = await Account.findOneAndDelete({ Id });

        if (!deletedAccount) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        return res.status(200).json({ success: true, account: deletedAccount });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const Id = req.user.Id;

    try {
        const account = await Account.findOne({ Id });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        if (!bcrypt.compareSync(currentPassword, account.password)) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        account.password = hashedNewPassword;

        await account.save();

        return res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const shouldSkipUpdate = (inputFields, existingAccount) => {
    const fieldsToUpdate = Object.entries(inputFields)
        .filter(([key, value]) => value !== undefined)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (Object.keys(fieldsToUpdate).length === 0) {
        return true;
    }

    const convert = {
        email: existingAccount.email,
        name: existingAccount.profile.name,
        gender: existingAccount.profile.gender,
        birthday: existingAccount.profile.birthday.toISOString().split('T')[0],
        phone: existingAccount.profile.phone,
        num: existingAccount.profile.address.num,
        street: existingAccount.profile.address.street,
        ward: existingAccount.profile.address.ward,
        district: existingAccount.profile.address.district,
        city: existingAccount.profile.address.city,
        role: existingAccount.role,
        locked: existingAccount.locked
    }
    
    return Object.entries(fieldsToUpdate).every(([key, value]) => {
        return convert[key] === value;
    });
};

module.exports = { register, login, getAll, getByID, update, remove, changePassword };
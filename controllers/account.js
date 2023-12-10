const Account = require('../models/account');
const bcrypt = require('bcrypt');
const get = require('lodash/get');
const set = require('lodash/set');
const { generateJWT } = require('../utils/jwt');
const { generateId } = require('../utils/auto-id');

const register = async (req, res) => {
    const { gmail, name, gender, birthday, phone, num, street, ward, district, city } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(gmail.split('@')[0], 10);

        const newAccount = new Account({
            Id: generateId('STF'),
            gmail: gmail,
            password: hashedPassword,
            profile: {
                name: name,
                gender: gender,
                birthday: birthday,
                phone: phone,
                address: { num: num, street: street, ward: ward, district: district, city: city },
                avatar: 'default.png'
            },
            // created: {
            //     Id: req.user.Id,
            //     name: req.user.name
            // }
        });

        await newAccount.save();

        // const token = await generateJWT(newAccount, 'register');
        // const link = `http://localhost:3000/account/password/change?source=register&token=${token}`
        return res.status(201).json({ success: true, title: 'Registed!', message: 'Account registered successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ gmail: `${username}@gmail.com` });

        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.status(400).json({ success: false, message: 'Invalid username or password.' });
        }
        if (account.actived === false) {
            return res.status(400).json({ success: false, message: 'Please login by clicking on the link in your gmail.' });
        }

        const token = await generateJWT(account, 'login');

        return res.status(200).json({ success: true, message: 'Login successful.', token: token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const Id = req.user.Id;

    try {
        const account = await Account.findOne({ Id });

        if (!account) {
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        if (!bcrypt.compareSync(currentPassword, account.password)) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        account.password = hashedNewPassword;

        await account.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const resetPassword = async (req, res) => {
    const value = req.body.value;

    try {
        let filter = {};

        if (/^\w+([\.-]?\w+)*@gmail\.com$/.test(value)) {
            filter = { gmail: value };
        } else if (/^\d{10,11}$/.test(value)) {
            filter = { 'profile.phone': value };
        } else if (/^[A-Za-z]{3}-\d{13}-\d{4}$/.test(value)) {
            filter = { Id: value };
        } else {
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        const account = await Account.findOne(filter);

        if (!account) {
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        // Thực hiện các bước cần thiết cho việc reset password

        return res.status(200).json({ success: true, message: 'Reset password request processed successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


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
        const account = await Account.findOne({ Id });
        if (!account) {
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        return res.status(200).json({ success: true, account: account });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const update = async (req, res) => {
    const { Id, gmail, name, gender, birthday, phone, num, street, ward, district, city, role, locked } = req.body;

    try {
        const updatedAccount = await Account.findOne({ Id });

        let diff = false;
        const updateFields = {
            gmail,
            'profile.name': name,
            'profile.gender': gender,
            'profile.phone': phone,
            'profile.address.num': num,
            'profile.address.street': street,
            'profile.address.ward': ward,
            'profile.address.district': district,
            'profile.address.city': city,
            role,
            locked,
        };

        for (const [key, value] of Object.entries(updateFields)) {
            if (value !== undefined && value !== get(updatedAccount, key)) {
                set(updatedAccount, key, value);
                diff = true;
            }
        }
        if (birthday !== undefined && birthday !== updatedAccount.profile.birthday.toISOString().slice(0, 10)) {
            updatedAccount.profile.birthday = birthday;
            diff = true;
        }
        if (req.file !== undefined) {
            updatedAccount.profile.avatar = req.file.filename;
            diff = true;
        }

        if (!diff) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        updatedAccount.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await updatedAccount.save();

        return res.status(200).json({ success: true, title: 'Updated!', message: 'Account updated successfully.', account: updatedAccount });
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
            return res.status(400).json({ success: false, message: 'Account not found.' });
        }

        return res.status(200).json({ success: true, title: 'Deleted!', message: 'Account deleted successfully.', account: deletedAccount });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { register, login, resetPassword, changePassword, getAll, getByID, update, remove };
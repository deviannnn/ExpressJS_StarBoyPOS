const Account = require('../models/account');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../utils/jwt');
const { generateId } = require('../utils/auto-id');

const register = async (req, res) => {
    const { email, name, gender, birthday, phone, address } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(email.split('@')[0], 10);

        const newAccount = new Account({
            Id: generateId('STF'),
            email: email,
            password: hashedPassword,
            profile: {
                name,
                gender,
                birthday,
                phone,
                address,
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
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the account in the database
        const account = await Account.findOne({ email: `${username}@gmail.com` });

        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate a JWT token
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

const get = async (req, res) => {
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
    const { Id, newData } = req.body;

    try {
        const updateInfo = {
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        };

        const updatedAccount = await Account.findOneAndUpdate(
            { Id },
            { $addToSet: { updated: updateInfo }, ...newData },
            { new: true }
        );
        
        if (!updatedAccount) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        return res.status(200).json({ success: true, account: updatedAccount });
    } catch (error) {
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

module.exports = { register, login, getAll, get, update, remove, changePassword };
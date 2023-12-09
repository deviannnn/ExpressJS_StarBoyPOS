const Customer = require('../models/customer');
const Account = require('../models/account');
const bcrypt = require('bcrypt');
const { generateId } = require('../utils/auto-id');

const register = async (req, res) => {
    const { name, phone } = req.body;

    try {
        const newCustomer = new Customer({
            Id: generateId('STC'),
            name: name,
            phone: phone,
            created: {
                Id: req.user.Id,
                name: req.user.name
            }
        });

        await newCustomer.save();

        return res.status(201).json({ success: true, title: 'Registed!', message: 'Customer registered successfully.', customer: newCustomer });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAll = async (req, res) => {
    try {
        const customers = await Customer.find();

        res.status(200).json({ success: true, customers: customers });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getByID = async (req, res) => {
    const { Id } = req.body;

    try {
        const customer = await Customer.findOne({ Id });
        if (!customer) {
            return res.status(400).json({ success: false, message: 'Customer not found.' });
        }

        return res.status(200).json({ success: true, customer: customer });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const update = async (req, res) => {
    const { Id, name, phone, password } = req.body;

    try {
        const updatedCustomer = await Customer.findOne({ Id });
        if (!updatedCustomer) {
            return res.status(400).json({ success: false, message: 'Customer not found.' });
        }

        let diff = false;
        if (name !== undefined && name !== updatedCustomer.name) {
            updatedCustomer.name = name;
            diff = true;
        }
        if (phone !== undefined && phone !== updatedCustomer.phone) {
            updatedCustomer.phone = phone;
            diff = true;
        }
        if (!diff) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        const adminAuth = await Account.findOne({ role: 'admin' });
        if (password === undefined || !adminAuth || !bcrypt.compareSync(password, adminAuth.password)) {
            return res.status(401).json({ success: false, message: 'Incorrect authentication.' });
        }

        updatedCustomer.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await updatedCustomer.save();

        return res.status(200).json({ success: true, title: 'Updated!', message: 'Customer updated successfully.', customer: updatedCustomer });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    const { Id } = req.body;

    try {
        const deletedCustomer = await Customer.findOneAndDelete({ Id });
        if (!deletedCustomer) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }

        return res.status(200).json({ success: true, title: 'Deleted!', message: 'Customer deleted successfully.', customer: deletedCustomer });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { register, getAll, getByID, update, remove };
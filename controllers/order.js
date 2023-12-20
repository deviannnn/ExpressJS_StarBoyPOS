const Order = require('../models/order');

const { generateOrderNumber } = require('../utils/auto-id');

const create = async (req, res) => {
    const { customer, cashier, summaryAmount, items, payment } = req.body;

    try {
        const newOrder = new Order({
            Id: await generateOrderNumber(payment.method, payment.type, false),
            customer: customer === undefined ? "WG" : customer,
            cashier,
            summaryAmount,
            items,
            payment
        });

        await newOrder.save();

        return res.status(201).json({ success: true, title: 'Created!', message: 'Order created successfully.', order: newOrder });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAll = async (req, res) => {
    try {
        const orders = await Order.find();

        return res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const get = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findOne({ Id: orderId });
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }

        return res.status(200).json({ success: true, order: order });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const update = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(400).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    const { orderId } = req.body;

    try {
        const deletedOrder = await Order.findOneAndDelete({ Id: orderId });
        if (!deletedOrder) {
            return res.status(400).json({ message: 'Order not found' });
        }

        return res.status(200).json({ success: true, title: 'Deleted!', message: 'Order deleted successfully.', order: deletedOrder });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { get, getAll, create, update, remove };
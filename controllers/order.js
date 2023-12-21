const createError = require('http-errors');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');

const { generateOrderNumber } = require('../utils/auto-id');
const { formatDateTime } = require('../utils/format');

const create = async (req, res) => {
    const { customer, summaryAmount, items, payment } = req.body;

    try {
        const customerRef = await Customer.findOne({ Id: (customer === undefined ? "WG" : customer) });
        const itemsWithObjectId = items.map(item => ({
            ...item,
            variant: new mongoose.Types.ObjectId(item.variant)
        }));

        const newOrder = new Order({
            Id: await generateOrderNumber(payment.method, payment.type, false),
            customer: customerRef._id,
            cashier: new mongoose.Types.ObjectId(req.user._id),
            summaryAmount,
            items: itemsWithObjectId,
            payment
        });

        await newOrder.save();

        return res.status(201).json({ success: true, title: 'Created!', message: 'Order created successfully.', order: newOrder });
    } catch (error) {
        console.log(error.message)
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

const renderInvoice = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        let order = await Order.findOne({ Id: orderId })
            .populate({
                path: 'customer',
                select: 'name'
            })
            .populate({
                path: 'cashier',
                select: 'profile.name'
            })
            .populate({
                path: 'items.variant',
                populate: {
                    path: 'product',
                    select: 'name'
                }
            })
            .exec();

        if (!order) {
            return next(createError(404));
        }

        order = {
            Id: order.Id,
            customer: order.customer.name,
            cashier: order.cashier.profile.name,
            date: formatDateTime(order.created),
            summaryAmount: order.summaryAmount,
            payment: order.payment,
            items: order.items.map(item => ({
                name: item.variant.product.name,
                color: item.variant.color,
                barcode: item.variant.barcode,
                quantity: item.quantity,
                price: item.price,
                amount: item.amount
            }))
        }

        res.render('invoice', { layout: null, order: order });
    } catch (error) {
        console.error('Error rendering invoice:', error);
        return next(createError(500));
    }
}

module.exports = { get, getAll, create, update, remove, renderInvoice };
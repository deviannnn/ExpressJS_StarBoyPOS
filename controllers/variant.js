const mongoose = require('mongoose');
const Variant = require('../models/variant');
const Product = require('../models/product');

const create = async (req, res) => {
    const { productId, barcode, color, cost, price, warn } = req.body;

    try {
        const existingProduct = await Product.findOne({ _id: productId });
        if (!existingProduct) {
            return res.status(400).json({ success: false, message: 'Product not found.' });
        }

        const newVariant = new Variant({
            product: new mongoose.Types.ObjectId(productId),
            img: req.file ? req.file.filename : 'default-variant.png',
            barcode: barcode,
            color: color,
            cost: cost,
            price: price,
            warn: warn,
            created: {
                Id: req.user.Id,
                name: req.user.name
            }
        });

        await newVariant.save();

        return res.status(201).json({ success: true, title: 'Created!', message: 'Variant created successfully.', variant: newVariant });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllByProductID = async (req, res) => {
    const { productId } = req.body;

    try {
        let variants = await Variant.find({ product: productId });
        if (variants.length === 0) {
            return res.status(400).json({ success: false, message: 'Variants not found with this Product ID' });
        }

        variants = variants.map((variant) => ({
            product: variant.product,
            barcode: variant.barcode,
            img: variant.img,
            color: variant.color,
            quantity: variant.quantity,
            cost: variant.cost,
            price: variant.price,
            warn: variant.warn,
            status: variant.getStatus(),
            timeline: variant.timeline,
            actived: variant.actived,
            created: variant.created,
            updated: variant.updated
        }))

        res.status(200).json({ success: true, variants: variants });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getByBarcode = async (req, res) => {
    const { barcode } = req.body;

    try {
        let variant = await Variant.findOne({ barcode });
        if (!variant) {
            return res.status(400).json({ success: false, message: 'Variant not found.' });
        }

        variant = { ...variant.toObject(), status: variant.getStatus() };

        return res.status(200).json({ success: true, variant: variant });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const update = async (req, res) => {
    const { barcode, newbarcode, color, cost, price, warn, actived } = req.body;

    try {
        const updatedVariant = await Variant.findOne({ barcode });
        if (!updatedVariant) {
            return res.status(400).json({ success: false, message: 'Variant not found.' });
        }

        let diff = false;
        if (newbarcode !== undefined && newbarcode !== updatedVariant.barcode) {
            updatedVariant.barcode = newbarcode;
            diff = true;
        }
        if (color !== undefined && color !== updatedVariant.color) {
            updatedVariant.color = color;
            diff = true;
        }
        if (cost !== undefined && cost !== updatedVariant.cost) {
            updatedVariant.cost = cost;
            diff = true;
        }
        if (price !== undefined && price !== updatedVariant.price) {
            updatedVariant.price = price;
            diff = true;
        }
        if (warn !== undefined && warn !== updatedVariant.warn) {
            updatedVariant.warn = warn;
            diff = true;
        }
        if (actived !== undefined && actived !== updatedVariant.actived) {
            updatedVariant.actived = actived;
            diff = true;
        }
        if (req.file !== undefined) {
            updatedVariant.img = req.file.filename;
            diff = true;
        }

        if (!diff) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        updatedVariant.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await updatedVariant.save();

        return res.status(200).json({ success: true, title: 'Updated!', message: 'Variant updated successfully.', variant: updatedVariant });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    const { barcode } = req.body;

    try {
        const deletedVariant = await Variant.findOneAndDelete({ barcode });

        if (!deletedVariant) {
            return res.status(404).json({ success: false, message: 'Variant not found.' });
        }

        return res.status(200).json({ success: true, title: 'Deleted!', message: 'Variant deleted successfully.', variant: deletedVariant });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { getAllByProductID, getByBarcode, create, update, remove };
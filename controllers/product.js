const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');

const create = async (req, res) => {
    const { categoryId, name, specs } = req.body;
    
    try {
        const existingCategory = await Category.findOne({ _id: categoryId });
        if (!existingCategory) {
            return res.status(400).json({ success: false, message: 'Category not found.' });
        }

        const newProduct = new Product({
            category: new mongoose.Types.ObjectId(categoryId),
            name: name,
            specs: specs,
            created: {
                Id: req.user.Id,
                name: req.user.name
            }
        });

        await newProduct.save();

        return res.status(201).json({ success: true, title: 'Created!', message: 'Product created successfully.', product: newProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAll = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({ success: true, products: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getByID = async (req, res) => {
    const { productId } = req.body;

    try {
        const existingProduct = await Product.findOne({ _id: productId });
        if (!existingProduct) {
            return res.status(400).json({ success: false, message: 'Product not found.' });
        }

        return res.status(200).json({ success: true, product: existingProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const update = async (req, res) => {
    const { categoryId, name, specs, actived } = req.body;

    try {
        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return res.status(400).json({ success: false, message: 'Product not found.' });
        }

        if (name === product.name) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        product.name = name;
        product.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await product.save();

        return res.status(200).json({ success: true, title: 'Updated!', message: 'Product\'s name updated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    const { productId } = req.body;

    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: productId });

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        return res.status(200).json({ success: true, title: 'Deleted!', product: deletedProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const goHandleView = async (req, res, next) => {
    const doAction = req.query.do;

    if (doAction === 'add') {
        res.render('product-handle', { title: 'Products', subTitle: 'New Product' });
    } else if (doAction === 'edit') {
        const productId = req.query.id;

        try {
            const editProduct = await Product.findOne({ _id: productId });
            if (!editProduct) {
                return next();
            }
            const id = editProduct._id.toString();
            const specs = editProduct.specs.map(spec => ({
                name: spec.name,
                options: spec.options.map(option => option.toString()),
                id: spec._id.toString()
            }));
            const product = { id, name: editProduct.name, specs };
            res.render('product-handle', { title: 'Products', subTitle: 'Edit Product', product: product });
        } catch (error) {
            return next();
        }

    } else {
        res.render('product-handle', { title: 'Products', subTitle: 'New Product' });
    }
}

module.exports = { goHandleView, getAll, getByID, create, update, remove };
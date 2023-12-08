const Category = require('../models/category');

const create = async (req, res) => {
    const { name } = req.body;

    try {
        const newCategory = new Category({
            name: name,
            created: {
                Id: req.user.Id,
                name: req.user.name
            }
        });

        await newCategory.save();

        return res.status(201).json({ success: true, title: 'Created!', message: 'Category created successfully.', category: newCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAll = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json({ success: true, categories: categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getByID = async (req, res) => {
    const { categoryId } = req.body;

    try {
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return res.status(400).json({ success: false, message: 'Category not found.' });
        }

        return res.status(200).json({ success: true, category: category });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const updateName = async (req, res) => {
    const { categoryId, name } = req.body;

    try {
        const updatedCategory = await Category.findOne({ _id: categoryId });
        if (!updatedCategory) {
            return res.status(400).json({ success: false, message: 'Category not found.' });
        }

        if (name === updatedCategory.name) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        updatedCategory.name = name;
        updatedCategory.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await updatedCategory.save();

        return res.status(200).json({ success: true, title: 'Updated!', message: 'Category\'s name updated successfully.', category: updatedCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    const { categoryId } = req.body;

    try {
        const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        return res.status(200).json({ success: true, title: 'Deleted!', category: deletedCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const addSpecs = async (req, res) => {
    const { categoryId, name, options } = req.body;

    try {
        const asCategory = await Category.findOne({ _id: categoryId });
        if (!asCategory) {
            return res.status(400).json({ success: false, message: 'Category not found.' });
        }

        asCategory.specs.push({ name, options });

        await asCategory.save();

        return res.status(200).json({ success: true, title: 'Added!', message: 'Specification added successfully.', category: asCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const updateSpecs = async (req, res) => {
    const { categoryId, specId, name, options } = req.body;

    try {
        const usCategory = await Category.findOne({ _id: categoryId });
        if (!usCategory) {
            return res.status(400).json({ success: false, message: 'Category not found.' });
        }

        const specIndex = usCategory.specs.findIndex(spec => spec._id.toString() === specId);
        if (specIndex === -1) {
            return res.status(404).json({ success: false, message: 'Specification not found.' });
        }

        const oldName = usCategory.specs[specIndex].name;
        const oldOptions = usCategory.specs[specIndex].options;
        if (name === oldName && JSON.stringify(options) === JSON.stringify(oldOptions)) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' });
        }

        usCategory.specs[specIndex].name = name;
        usCategory.specs[specIndex].options = options;

        usCategory.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await usCategory.save();

        return res.status(200).json({ success: true, title: 'Updated!', message: 'Specification updated successfully.', category: usCategory });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const removeSpecs = async (req, res) => {
    const { categoryId, specId } = req.body;

    try {
        const rsCategory = await Category.findOne({ _id: categoryId });
        if (!rsCategory) {
            return res.status(400).json({ success: false, message: 'Category not found.' });
        }

        const specIndex = rsCategory.specs.findIndex(spec => spec._id.toString() === specId);
        if (specIndex === -1) {
            return res.status(404).json({ success: false, message: 'Specification not found.' });
        }

        rsCategory.specs.splice(specIndex, 1);
        rsCategory.updated.push({
            Id: req.user.Id,
            name: req.user.name,
            datetime: Date.now(),
        });

        await rsCategory.save();

        return res.status(200).json({ success: true, title: 'Deleted!', message: 'Specification deleted successfully.', category: rsCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const goHandleView = async (req, res, next) => {
    const doAction = req.query.do;

    if (doAction === 'add') {
        res.render('category-handle', { title: 'Categories', subTitle: 'New Category' });
    } else if (doAction === 'edit') {
        const categoryId = req.query.id;

        try {
            const editCategory = await Category.findOne({ _id: categoryId });
            if (!editCategory) {
                return next();
            }
            const id = editCategory._id.toString();
            const specs = editCategory.specs.map(spec => ({
                name: spec.name,
                options: spec.options.map(option => option.toString()),
                id: spec._id.toString()
            }));
            const category = { id, name: editCategory.name, specs };
            res.render('category-handle', { title: 'Categories', subTitle: 'Edit Category', category: category });
        } catch (error) {
            return next();
        }

    } else {
        res.render('category-handle', { title: 'Categories', subTitle: 'New Category' });
    }
}

module.exports = { goHandleView, getAll, getByID, create, updateName, addSpecs, updateSpecs, removeSpecs, remove };
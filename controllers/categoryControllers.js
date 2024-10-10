
const categoryModel = require('../models/categoryModel')


class categoryController {
    add_category = async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                res.status(400).json({ message: "Category not found" })
            }

            const category = new categoryModel({ name });
            await category.save();
            return res.status(201).json({ message: 'category add success', category })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    edit_category = async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = await categoryModel.findById(id);

            if (!category) {
                res.status(400).json({ message: "Category not found" })
            }

            category.name = name || category.name;
            await category.save();
            return res.status(201).json({ message: 'category edit success', category })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    delete_category = async (req, res) => {
        try {
            const { id } = req.params;
            const category = await categoryModel.findById(id);

            if (!category) {
                res.status(400).json({ message: "Category not found" })
            }

            await category.deleteOne();
            return res.status(201).json({ message: 'category delete success' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_categories = async (req, res) => {
        try {
            const categories = await categoryModel.find();
            return res.status(201).json({ message: 'categories get success', categories })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}


module.exports = new categoryController()
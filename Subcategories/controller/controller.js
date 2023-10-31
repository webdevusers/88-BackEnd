const Subcategory = require('../models/Subcategory')
const Category = require('../../Categories/models/category')

class SubcategoryController {
    async create(req, res) {
        try {
            const {array, id} = req.body;
            const subcategories = await Subcategory.insertMany(array);

            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({status: 'exists'});
            }

            subcategories.forEach(product => {
                category.subcategories.push(product._id);
            });

            await category.save();

            res.status(201).json({added: "true"})
        } catch (e) {
            console.log(e);
            res.status(400).json({error: `${e}`});
        }

    }
    async edit(req, res) {
        const {id, updatedData} = req.body;

        const item = await Subcategory.findById(id);

        if (!item) {
            res.status(404).json({status: "exists"})
        }


        item.title = updatedData.title
        item.image = updatedData.image

        await item.save()

        res.status(200).json({saved: "true"})
    }
    async delete(req, res) {
        const {id} = req.body;

        const item = await Subcategory.findByIdAndDelete(id);
        if (!item) {
            res.status(404).json({status: "exist"})
        }
        res.status(200).json({status: `deleted ${item}`})
    }
    async find(req, res) {
        const {id} = req.body;

        const item = Subcategory.findById(id);

        if (!item) {
            res.status(404).json({status: "exist"})
        }
        res.status(200).json({item})
    }
    async populate(req, res) {
        const {id} = req.body;

        const item = await Subcategory.findById(id).populate('sections')
        if (!item) {
            res.status(400).json({status: "exist"})
        }
        res.status(400).json({item})
    }
}

module.exports = new SubcategoryController();
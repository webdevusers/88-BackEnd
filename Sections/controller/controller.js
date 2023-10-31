const Subcategory = require('../../Subcategories/models/Subcategory')
const Section = require('../models/section')

class SectionController {
    async create(req, res) {
        try {
            const { array, id } = req.body;
            const sections = await Section.insertMany(array);

            const subcategory = await Subcategory.findById(id);
            if (!subcategory) {
                return res.status(404).json({status: 'Section exists'});
            }

            sections.forEach(section => {
                subcategory.sections.push(section._id);
            });

            await subcategory.save();

            res.status(201).json({status: 'Sections added successfully'})
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: `${e}` });
        }
    }
    async edit(req, res) {
        const {id, updatedData} = req.body;

        const item = await Section.findById(id);

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

        const item = await Section.findByIdAndDelete(id);
        if (!item) {
            res.status(404).json({status: "exist"})
        }
        res.status(200).json({status: `deleted ${item}`})
    }
    async find(req, res) {
        const {id} = req.body;

        const item = Section.findById(id);

        if (!item) {
            res.status(404).json({status: "exist"})
        }
        res.status(200).json({item})
    }
    async populate(req, res) {
        const {id} = req.body;

        const item = await Section.findById(id).populate('products')
        if (!item) {
            res.status(400).json({status: "exist"})
        }
        res.status(400).json({item})
    }
}
module.exports = new SectionController();
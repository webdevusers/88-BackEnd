const Section = require('../../Sections/models/section')
const Product = require('../models/product')
class ProductController {
    async create(req, res) {
        try {
            const { array, id } = req.body;
            const products = await Product.insertMany(array);

            const section = await Section.findById(id);
            if (!section) {
                return res.status(404).json({status: 'Section exists'});
            }

            products.forEach(product => {
                section.products.push(product._id);
            });

            await section.save();

            res.status(201).json({status: 'Products added successfully'})
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: `${e}` });
        }
    }
    async edit(req, res) {
        const {id, updatedData} = req.body;

        const item = await Product.findById(id);

        if (!item) {
            res.status(404).json({status: "exists"})
        }


        item.title = updatedData.title
        item.desc = updatedData.desc
        item.chars = updatedData.chars
        item.price = updatedData.price
        item.oldPrice = updatedData.oldPrice
        item.images = updatedData.images

        await item.save()

        res.status(200).json({saved: "true"})
    }
    async delete(req, res) {
        const {id} = req.body;

        const item = await Product.findByIdAndDelete(id);
        if (!item) {
            res.status(404).json({status: "exist"})
        }
        res.status(200).json({status: `deleted ${item}`})
    }
    async find(req, res) {
        const {id} = req.body;

        const item = Product.findById(id);

        if (!item) {
            res.status(404).json({status: "exist"})
        }
        res.status(200).json({item})
    }
    async addReview(req, res) {
        const { name, email, text, ratingVoid, id } = req.body;
        const item = await Product.findById(id);

        if (!item) {
            res.status(404).json({ status: "exist" });
        }

        item.reviews.push({
            name,
            email,
            text,
            ratingVoid,
            replies: []
        });


        const totalReviews = item.reviews.length;

        res.json({ item, totalReviews });
    }
    // async addReplies(req, res) {
    //     const { name, email, text, id } = req.body;
    //     const item = await Product.findById(id).populate('reviews');
    //
    //     if (!item) {
    //         res.status(404).json({ status: "exist" });
    //     }
    //
    //     const reviewIndex = item.reviews.length - 1;
    //     item.reviews[reviewIndex].replies.push({name, email, text});
    //
    //     res.json({ item });
    // }


}

module.exports = new ProductController();
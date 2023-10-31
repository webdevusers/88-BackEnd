const {Schema, model} = require('mongoose');

const Product = new Schema({
    title: String,
    desc: String,
    chars: Array,
    price: Number,
    oldPrice: Number,
    reviews: Array,
    views: Number,
    likes: Number,
    images: Array
})

module.exports = model('Product', Product)
const {Schema, model} = require('mongoose');

const Category = new Schema({
    title: { required: true, type: String},
    icon: {required: true, type: String},
    image: {type: String, required: true},
    subcategories: [{type: Schema.Types.ObjectId, ref: 'Subcategory'}],
})

module.exports = model('Category', Category)
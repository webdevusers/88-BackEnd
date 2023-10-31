const {Schema, model} = require('mongoose');

const Subcategory = new Schema({
    title: { required: true, type: String},
    image: {type: String, required: true},
    sections: [{type: Schema.Types.ObjectId, ref: 'Section'}],
})

module.exports = model('Subcategory', Subcategory)
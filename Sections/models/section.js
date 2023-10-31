const {Schema, model} = require('mongoose');

const Section = new Schema({
    title: { required: true, type: String},
    image: {type: String, required: true},
    products: [{type: Schema.Types.ObjectId, ref: 'Products'}],
})

module.exports = model('Section', Section)
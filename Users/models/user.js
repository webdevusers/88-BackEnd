const {Schema, model} = require('mongoose');

const User = new Schema({
    name: String,
    email: { type: String, unique: true},
    password: String,
    deliveryAddresses: Array,    
    orders: Array,
    created: { type: Date, default: Date.now },
    customerRating: Number,
    status: String,
    favorites: Array,
    cart: Array,
    views: Array,
})

module.exports = model('User', User)
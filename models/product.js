const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema ({
    productName: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    }
});



const productSchema = mongoose.model('Product', ProductSchema);
module.exports = {Product: productSchema};
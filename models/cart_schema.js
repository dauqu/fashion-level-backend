const mongoose = require('mongoose');


//Schema for add to cart
const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    product_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Product"
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        default: 0
    },
    product_name: {
        type: String,
        required: true
    },
    product_image: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('cart', cartSchema);
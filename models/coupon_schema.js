// coupon schema 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    minOrderAmount: {
        type: Number,
        required: true,
    }
},{
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
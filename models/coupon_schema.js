// coupon schema 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: "Coupon",
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    image: {
        type: String,
        required: true,
        default: "https://www.shutterstock.com/image-vector/coupon-scissors-cut-template-dashed-260nw-1562412643.jpg",
    },
    discount: {
        type: Number,
        required: true,
    },
    discount_type: {
        type: String,
        required: true,
        default: "amount",
    },
    minOrderAmount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    one_time: {
        type: Boolean,
        required: true,
        default: true
    },
    status: {
        type: String,
        required: true,
        default: "active"
    },
},{
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
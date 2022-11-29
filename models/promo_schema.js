const mongoose = require("mongoose")

const PromoSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        usage: {
            type: Number,
            required: true
        },
        sales: {
            type: Number,
            required: true
        },
        net_amount: {
            type: Number,
            required: true
        }
}, {
    timestamps: true
})

module.exports = mongoose.model("Promo", PromoSchema);
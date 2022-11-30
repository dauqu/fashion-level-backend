const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    requested_date: {
        type: "String",
        required: true
    },
    amount: {
        type: Number,
        required: true     
    },
    products: {
        type: Array,
        required: true,
        product: {
            product_id: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    },
    storeId: {
        type: String,
        required: true
    },
    pickup_slot: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Order", OrderSchema);
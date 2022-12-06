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
    products: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Products"
        }
    ],
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    pickup_slot: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
         required: true,
         default: "unpaid"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Order", OrderSchema);
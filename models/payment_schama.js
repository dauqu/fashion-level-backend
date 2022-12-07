const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    mode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Payment", PaymentSchema);
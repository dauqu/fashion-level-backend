const mongoose = require("mongoose")

const StatementSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    storeId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Statement", StatementSchema);
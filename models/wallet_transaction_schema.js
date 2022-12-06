const mongoose = require("mongoose")

const WalletTransactionSchema = new mongoose.Schema({
    customer: {
        type: Array,
        required: true,
        customer_id: {
            type: String,
            required: true,
        },
        customer_name: {
            type: String,
            required: true,
        }
    },
    mode: {
        type: String,
        required: true
    },
    approved_time: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("WalletTransactions", WalletTransactionSchema);
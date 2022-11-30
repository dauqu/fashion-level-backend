const mongoose = require("mongoose")

const WalletSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Wallet", WalletSchema);
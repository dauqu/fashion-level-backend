const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    dp: {
        type: String,
        required: true
    },
    phone_no: {
        type: Number,
        required: true
    },
    phone_verified: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email_verified: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false,
        default: "active"
    },
    total_orders: {
        type: Number,
        required: true,
        default: 0
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User", UserSchema);
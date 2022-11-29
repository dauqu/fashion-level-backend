const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    dp: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    phone: {
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
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User", UserSchema);
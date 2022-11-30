const mongoose = require("mongoose")

const StaffSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
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
    dp: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true    
    },
    address: {
        type: Array,
        required: true,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pin_code: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    
})

module.exports = mongoose.model("Staff", StaffSchema)
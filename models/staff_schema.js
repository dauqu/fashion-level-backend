const mongoose = require("mongoose")

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Roles"
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Staff", StaffSchema)
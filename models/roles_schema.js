const mongoose = require("mongoose")

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    for: {
        type: String, 
        required: true  
    }
})

module.exports = mongoose.model("Roles", RoleSchema)
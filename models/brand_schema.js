const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        banner: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: "publish"

        }
        
}, {
    timestamps: true
})

module.exports = mongoose.model("Brand", BrandSchema);
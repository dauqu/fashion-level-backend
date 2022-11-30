const mongoose = require("mongoose")

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Favorite", FavoriteSchema)
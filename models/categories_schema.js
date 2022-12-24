const mongoose = require("mongoose")

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
        default: 1
    },
    subcategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }
    ],
    isSubcategory: {
        type: Boolean,
        required: true,
        default: false
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Category", CategoriesSchema);
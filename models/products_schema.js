const mongoose = require("mongoose");


const allreviews = new mongoose.Schema({
    comments: String,
    rating: Number,
});
  
//gallery
const gallery = new mongoose.Schema({
    image: Array,   
});

const ProductsSchema = new mongoose.Schema({
    title: {
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
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category"
    },
    brand: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Brand",
        required: true
    },
    sku: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    sold_item: {
        type: Number,
        required: false,
        default: 0
    },
    variable: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "draft"
    },
    featured_image: {
        type: String,
        required: true,
    },
    gallery: [{
        type: String,
        required: false,
    }],
    sale_price: {
        type: Number,
        required: true,
    },
    regular_price: {
        type: Number,
        required: true
    },
    stock_status: {
        type: String,
        required: true,
    },
    enable_reviews: {
        type: Boolean
    },
    avarage_reviews: {
        type: Number
    },
    all_reviews: allreviews,

    enable_comments: {
        type: Boolean,
        required: false,
        default: true
    },
    currency: {
        type: String,
        required: true,
        default: "USD"
    },
    additional_information: {
        type: String,
        required: false,
    },
    isprivate: {
        type: Boolean,
        required: false,
    },
    tax_status: {
        type: String,
        required: false,
    },
    tax_class: {
        type: String,
        required: false,
    },
    publisher: {
        type: String,
        required: true,
    },
    store:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Store",
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Products", ProductsSchema);
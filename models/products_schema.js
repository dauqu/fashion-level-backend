const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    name: {
        type: Array,
        required: true,
        product_name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        unit: {
            type: String,
            required: true,
        },
        minimum_purchase_quantity: {
            type: Number,
            required: true,
        },
        barcode: {
            type: String,
            required: true,
        },
    },
    product_price_stock: {
        type: Array,
        required: true,
        unit_price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        discount_data_range: {
            type: Array,
            required: true,
            start_date: {
                type: String,
                required: true,
            },
            end_date: {
                type: String,
                required: true,
            },
        },
        sku: {
            type: String,
            required: true,
        },
    },
    product_images: {
        type: Array,
        required: true,
        image: {
            type: String,
            required: true,
        },
        image_alt: {
            type: String,
            required: true,
        },
    },
    product_description: {
        type: Array,
        required: true,
        description: {
            type: String,
            required: true,
        },
        description_alt: {
            type: String,
            required: true,
        },
    },
    slect_your_size_chart: {
        type: Array,
        required: true,
        size: {
            type: String,
            required: true,
        },
        size_chart: {
            type: String,
            required: true,
        },
    },
    settings: {
        type: Array,
        required: true,
        product_status: {
            type: String,
            required: true,
        },
        product_visibility: {
            type: String,
            required: true,
        },
    },
});

module.exports = mongoose.model("Products", ProductsSchema);
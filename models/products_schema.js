const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    name: {
        type: Object,
        required: true,
        product_name: {
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
    brand: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "Brand"
    },
    product_price_stock: {
        type: Object,
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
            type: Object,
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
        type: Object,
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
        type: Object,
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
        type: Object,
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
        type: Object,
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
    total_orders: {
        type: Number,
        required: true,
        default: 0
    },
    quantity_sold: {
        type: Number,
        required: true,
        default: 0
    },
    store: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Store"
    }
});

module.exports = mongoose.model("Products", ProductsSchema);
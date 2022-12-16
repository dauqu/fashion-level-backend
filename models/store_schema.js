const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
    business_name: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    business_address: {
        type: String,
        required: true,
    },
    type_of_business: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: true,
    },
    plateform_commision: {
        type: Number,
        required: true,
    },
    category_commision: {
        type: Number,
        required: true,
    },
    quantity_sold: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Store", StoreSchema);
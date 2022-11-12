const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
    business_name: {
        type: String,
        required: true,
    },
    business_address: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    type_of_business: {
        type: Array,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
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
});

module.exports = mongoose.model("Store", StoreSchema);
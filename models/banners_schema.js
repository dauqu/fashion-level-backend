const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannersSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Banners', BannersSchema);
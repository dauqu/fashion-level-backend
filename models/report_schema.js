const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    report_type: {
        type: String,
        required: false,
    },
    product_id:
    {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Products"
    },
    title: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Report", ReportSchema);
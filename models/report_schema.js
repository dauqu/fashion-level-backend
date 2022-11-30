const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }, 
    issue: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Report", ReportSchema);
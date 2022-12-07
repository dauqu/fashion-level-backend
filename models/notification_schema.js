const mongoose = require("mongoose")

const NotificationsSchema = new mongoose.Schema({
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        send_time: {
            type: String,
            required: false,
            default: Date.now()
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        }
}, {
    timestamps: true
})

module.exports = mongoose.model("Notification", NotificationsSchema);
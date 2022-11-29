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
        link: {
            type: String,
        },
        send_time: {
            type: String,
        }
}, {
    timestamps: true
})

module.exports = mongoose.model("Notification", NotificationsSchema);
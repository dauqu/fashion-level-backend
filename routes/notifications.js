const express = require('express');
const router = express.Router();
const Notification = require("../models/notification_schema");

//Get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//Get notification by id
router.get('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found", status: "error" });
        }
        res.status(200).json({ message: "Notification found", status: "success", notification: notification });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


//Create notification
router.post('/', async (req, res) => {

    console.log(req.body);

    const notification = new Notification({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        link: req.body.link,
        send_time: req.body.send_time,
    });

    try {
        const newNotification = await notification.save();
        res.status(201).json({ message: "Notification created", status: "success", notification: newNotification });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});





module.exports = router;
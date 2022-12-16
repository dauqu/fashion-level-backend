const express = require('express');
const router = express.Router();
const Notification = require("../models/notification_schema");
const upload = require('../config/fileuploader');
const mongoose = require('mongoose');
const User = require('../models/user_schema');

//Get all notifications by page no
router.get('/page/:page_no', async (req, res) => {
    try {

        // check valid pages
        let page_no = req.params.page_no;
        page_no = Number(page_no);
        if(!page_no || page_no <= 0){
            return res.status(205).send({message: "Invalid page no", status: "warning"});
        }
        // get data with skip and limit 
        let toSkip = (page_no-1)*10;
        const notifications = await Notification.find().skip(toSkip).limit(10);

        //pagination
        let pagination = [];
        for(let i=1; i<= Math.ceil(notifications.length/10); i++){
            pagination.push(i);
        }
        return res.status(200).send({message:"Notification fetched", status: "success", notifications, pagination});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

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

// delete a notification by id 
router.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found", status: "error" });
        }
        await notification.remove();
        res.status(200).json({ message: "Notification deleted", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});



//Create notification
router.post('/', upload.single("image"), async (req, res) => {
    try {
        const {user, title, description} = req.body;
       
        const url = req.protocol + '://' + req.get('host');
        const notification = new Notification({
            title: title,
            description: description,
            image: url+ '/'+req.file.filename,
            user: user
        });
        const newNotification = await notification.save();
        res.status(200).json({ message: "Notification created", status: "success", notification: newNotification });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});





module.exports = router;
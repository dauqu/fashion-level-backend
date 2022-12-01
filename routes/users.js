const router = require("express").Router();
const User = require("../models/user_schema");
const Order = require('../models/order_schema');


// get all users 
router.get("/", async (req, res) => {
    try {
        const active_users = await User.find();
        return res.status(200).json({message: "users found", status: "success", active_users})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})


router.get("/active-users", async (req, res) => {
    try {
        const active_users = await User.find({status: "active"});
        return res.status(200).json({message: "users found", status: "success", active_users})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

router.get("/blocked-users", async (req, res) => {
    try {
        const active_users = await User.find({status: "blocked"});
        return res.status(200).json({message: "users found", status: "success", active_users})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

router.get("/inactive-users", async (req, res) => {
    try {
        const active_users = await User.find({status: "inactive"});
        return res.status(200).json({message: "users found", status: "success", active_users})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

router.get("/order-details/:status", async (req, res) => {
    try {
        const {status} = req.params;

        const order_details = await Order.find({status});
        if(order_details.length <= 0){
            return res.status(404).json({message: "No orders found", status: "warning"})
        }
        return res.status(200).json({message: "Orders found", status: "success", order_details})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})


module.exports = router;
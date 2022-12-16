const router = require("express").Router();
const User = require("../models/user_schema");
const Order = require("../models/order_schema");

// get all users count by status
router.get('/count', async (req, res) => {
    try {
        const allUsers = await User.find({});
        const activeUsers = await User.find({ status: "active" });
        const inactive = await User.find({ status: "inactive" });
        const blockedUsers = await User.find({ status: "blocked" });

        res.status(200).json({ message: "Users count found", status: "success", data: { allUsers: allUsers.length, active: activeUsers.length, inactive: inactive.length, blocked: blockedUsers.length } });
    } catch (e) {
        res.status(500).json({ message: e.message, status: "error" })
    }
});


//delete users by user id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(200).json({ message: "User not found", status: "warning" });
        }
        // find orders by this user 
        const findOrders = await Order.find({ order_by: id });
        if(findOrders.length > 0){
            return res.status(200).json({ message: "Cannot delete users, User have active orders.", status: "warning" });
        }
        const deleteUser = await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted", status: "success", data: deleteUser });
    } catch (e) {
        res.status(500).json({ message: e.message, status: "error" })
    }
});


//get all users by page no(filter: status)
router.get('/page/:status/:page_no', async (req, res) => {
    try {
        const { status, page_no } = req.params;
        let PageNo = Number(page_no);
        if (PageNo <= 0) {
            return res.status(404).json({ message: "Invalid page no.", status: "warning" })
        }

        let toSkip = (PageNo - 1) * 10;
        const all = await User.find({ status });
        const allUsers = await User.find({ status }).skip(toSkip).limit(10);


        let all_pages = [];
        for (let i = 1; i <= Math.ceil(all.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({ message: "Users found", status: "success", data: allUsers, pagination: all_pages });
    } catch (e) {
        res.status(500).json({ message: e.message, status: "error" })
    }
});

//get all users by status
router.get('/all/:page_no/', async (req, res) => {
    try {
        const { page_no } = req.params;
        let PageNo = Number(page_no);
        if (PageNo <= 0) {
            return res.status(404).json({ message: "Invalid page no.", status: "warning" })
        }

        let toSkip = (PageNo - 1) * 10;
        const allUsers = await User.find({}).skip(toSkip).limit(10);

        if (allUsers.length <= 0) {
            res.status(404).json({ message: "No users found", status: "warning" });
        }

        let all_pages = [];
        for (let i = 1; i <= Math.ceil(allUsers.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({ message: "Products found", status: "success", allUsers, pagination: all_pages });
    } catch (e) {
        res.status(500).json({ message: e.message, status: "error" })
    }
});


// get all users 
router.get("/", async (req, res) => {
    try {
        const all_users = await User.find();
        return res.status(200).json({ message: "users found", status: "success", allUsers: all_users })
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "error" })
    }
})

// router.get("/order-details/:status", async (req, res) => {
//     try {
//         const {status} = req.params;

//         const order_details = await Order.find({status});
//         if(order_details.length <= 0){
//             return res.status(404).json({message: "No orders found", status: "warning"})
//         }
//         return res.status(200).json({message: "Orders found", status: "success", order_details})
//     } catch (error) {
//         return res.status(500).json({message: error.message, status: "error"})
//     }
// })


module.exports = router;
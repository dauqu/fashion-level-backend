const router = require("express").Router();
const User = require("../models/user_schema");


//get all users by page no(filter: status)
router.get('/page/:status/:page_no', async (req, res) => {
    try{
        const {status, page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0) {
            return res.status(404).json({message: "Invalid page no.", status: "warning"})
        }

        let toSkip = (PageNo-1)*10;
        const allUsers = await User.find({status}).skip(toSkip).limit(10);

        if(allUsers.length <= 0){
            res.status(200).json({message: "No Users found", status: "warning"});
        }
        let all_pages = [];
        for (let i = 1; i <= Math.ceil(allUsers.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({message: "Products found", status: "success",  data: allProducts, pagination: all_pages});
    }catch(e){
        res.status(500).json({message: e.message, status: "error"})
    }
});

//get all users by status
router.get('/all/:page_no/', async (req, res) => {
    try{
        const {page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0) {
            return res.status(404).json({message: "Invalid page no.", status: "warning"})
        }

        let toSkip = (PageNo - 1)*10;
        const allUsers = await User.find({}).skip(toSkip).limit(10);
        
        if(allUsers.length <= 0){
            res.status(404).json({message: "No users found", status: "warning"});
        }

        let all_pages = [];
        for (let i = 1; i <= Math.ceil(allUsers.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({message: "Products found", status: "success", allUsers, pagination: all_pages});
    }catch(e){
        res.status(500).json({message: e.message, status: "error"})
    }
});


// get all users 
router.get("/", async (req, res) => {
    try {
        const all_users = await User.find();
        return res.status(200).json({message: "users found", status: "success", allUsers: all_users})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
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
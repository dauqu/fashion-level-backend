const router = require('express').Router();

const { Aggregate } = require('mongoose');
const { aggregate } = require('../models/order_schema');
const Order = require("../models/order_schema");



// get all orders filter(status)
router.get('/full/status/:status', async (req, res) => {
    try {
        const {status}=req.params;

        const ans = await Order.find({status}).populate([
            { 
                path: "user",
                select: "-otp -password"
            },
            {
                path: "products",
                populate: [
                    {
                        path: "store"
                    }
                ]
            }
        ]);
        res.status(200).json({messsage: "Get Success", status: "success", data: ans});
    } catch (error) {
        res.status(500).json({messsage: error.message, status: "error"});
    }
})

// get all orders with their product and store details 
router.get('/full', async (req, res) => {
    try {
        
        const ans = await Order.find({}).populate([
            { 
                path: "user"
            },
            {
                path: "products",
                populate: [
                    {
                        path: "store"
                    }
                ]
            }
        ]);
        res.status(200).json({messsage: "Get Success", status: "success", data: ans});
    } catch (error) {
        res.status(500).json({messsage: error.message, status: "error"});
    }
})






// get all orders 
router.get('/', async (req, res) => {
    const all_orders = await Order.find({});
    if (all_orders) {
        return res.json(all_orders);
    }
})


// get order by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const one_order = await Order.findOne({ _id: id });

        if (!one_order) {
            return res.status(404).json({ message: "order not found", status: "warning" });
        }
        return res.status(200).json({ message: "order found", status: "success", order: one_order });
    }
    catch (e) {
        return res.status(400).json({ message: e.message, status: "error" });
    }
})

// get all order by order status
router.get('/status/:status', async (req, res) => {
    try {

        const { status } = req.params;

        const all_orders = await Order.find({ status });
        if (all_orders.length <= 0) {
            return res.json({ message: "No orderes found", status: "warning" });
        }

        return res.status(200).json({ message: "order found", status: "success", orders: all_orders });
    }
    catch (e) {
        return res.status(400).json({ message: e.message, status: "error" });
    }
})
router.get('/status/:status/:page', async (req, res) => {
    try {

        const { status, page } = req.params;
        let pageNo = Number(page);
        if (pageNo <= 0) return res.json({ message: "please provide legal page no", status: "warning" })

        let toSkip = (pageNo - 1) * 10;
        const all_orders = await Order.find({ status })
        .populate([
            { 
                path: "user"
            },
            {
                path: "products",
                populate: [
                    {
                        path: "store"
                    }
                ]
            }
        ])
        .skip(toSkip).limit(10);
        if (all_orders.length <= 0) {
            return res.json({ message: "No orderes found", status: "warning" });
        }
        let all_pages = [];
        for (let i = 1; i <= Math.ceil(all_orders.length / 10); i++) {
            all_pages.push(i);
        }
        return res.status(200).json({ message: "order found", status: "success", orders: all_orders, pagination: all_pages });
    }
    catch (e) {
        return res.status(400).json({ message: e.message, status: "error" });
    }
})

//add new order
router.post('/', async (req, res) => {
    try {
        const new_order = new Order(req.body);
        const save_order = await new_order.save()

        if (save_order) {
            res.json({ "message": "Order Succesfully Added", status: "success" })
        }
    } catch (e) {
        res.json({ "message": e.message, status: "error" })
    }

})

//delete order by id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const is_order = await Order.findById({ _id: id });
        if (!is_order) {
            return res.status(404).json({ message: "Brand not found", status: "error" })
        }
        await Order.findByIdAndDelete({ _id: id });
        return res.status(200).json({ message: "Brand deleted", status: "success" })
    } catch (e) {
        res.status(500).json({ message: e.message, status: "error" })
    }
})

//update order by id
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const get_order = await Order.findOneAndUpdate({ _id: id }, update, { new: false });
        get_order.save();

        return res.status(200).json({ message: "Order updated", status: "success" })

    } catch (e) {
        return res.status(400).json({ message: e.message, status: "error" })
    }

})

module.exports = router;
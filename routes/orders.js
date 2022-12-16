const router = require('express').Router();
const mongoose = require('mongoose');

const Order = require("../models/order_schema");
const Product = require("../models/products_schema");



// get total orders by status and page no
router.get('/page/:status/:page_no', async (req, res) => {
    try{
        const {status, page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0 ){
            return res.status(205).json({
                message: "Invalid page no",
                status: "error"
            })
        }

        const all = await Order.find({status});
        const allOrders = await Order.find({ status }).populate([
            { 
                path: "order_by",
                select: "_id first_name last_name" 
            }
        ]).skip((PageNo-1)*10).limit(10);
        
        let pagination = [];
        for(let i=1; i<=Math.ceil(all.length/10); i++){
            pagination.push(i);
        }
        return res.status(200).json({message: "Orders found", status: "success", orders: allOrders, pagination});
    }
    catch(e){
        res.status(400).json({message: e.message, status: "error"})
    }
});


// get all orders count by status
router.get('/count', async (req, res) => {
    try{
        const allOrders = await Order.find({});
        const pending = allOrders.filter((order) => order.status == "pending").length;
        const shipped = allOrders.filter((order) => order.status == "shipped").length;
        const delivered = allOrders.filter((order) => order.status == "delivered").length;
        const cancelled = allOrders.filter((order) => order.status == "cancelled").length;
        const returned = allOrders.filter((order) => order.status == "return").length;

        return res.status(200).json({message: "Orders count",
        status: "success",
        data: {
            pending,
            shipped,
            delivered,
            cancelled,
            return: returned
        }})
    }catch(e){
        res.status(400).json({message: e.message, status: "error"})
    }
})

//get total orders with page no
router.get('/order-overview/page/:page_no', async (req, res) => {
    try{
        const {page_no} = req.body;
        let PageNo = Number(page_no);
        if(PageNo <= 0 ){
            return res.status(205).json({
                message: "Invalid page no",
                status: "Error"
            })
        }
        const totalOrders = await Order.find({});
        let pagination = [];
        for(let i=1; i<=Math.ceil(totalOrders.length); i++){
            pagination.push(i);
        }
        return res.status(200).json({message: "Orders found", status: "success", orders: totalOrders, pagination});
    }
    catch(e){
        res.status(400).json({message: e.message, status: "error"})
    }
})

//get total orders with total value
router.get('/order-overview/', async (req, res) => {
    try{
        const totalOrders = await Order.find({});
        let total_orders = totalOrders.length;
        let total_price = 0;
        totalOrders.forEach((order) => {
            total_price += order.amount;
        })
        return res.status(200).json({message: "Orders found", status: "success", total_orders, orders_price: total_price});
    }
    catch(e){
        res.status("400").json({message: e.message, status: "error"})
    }
})


// get all orders with user details
router.get('/full/page/:page_no', async (req, res) => {
    try {
        const {page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0) {
            return res.status(400).json({message: "Invalid page no.", status: "warning"})
        }

        let toSkip = (PageNo-1)*10;
        const all = await Order.find({});
        const allOrders = await Order.find({}).populate([
            { 
                path: "order_by",
                select: "_id first_name last_name email dp phone_no username language country"
            }
        ]).skip(toSkip).limit(10);

        let all_pages = [];
        for (let i = 1; i <= Math.ceil(all.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({messsage: "Get Success", status: "success", allOrders, pagination: all_pages});
    } catch (error) {
        res.status(500).json({messsage: error.message, status: "error"});
    }
})

// get all orders filter(status)
router.get('/full/status/:status', async (req, res) => {
    try {
        const {status}=req.params;

        const ans = await Order.find({status}).populate([
            { 
                path: "order_by",
                select: "_id first_name last_name email dp phone_no username language country"
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
                path: "order_by",
                select: "_id first_name last_name email dp phone_no username language country"
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
        const {  products } = req.body;

        // random 6 digit number
        const orderId = Math.floor(100000 + Math.random() * 900000);
        

        let o_products = products.map(s => mongoose.Types.ObjectId(s));
        Product.aggregate([
            {
                $match: {
                    _id: { $in: o_products }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$sale_price" }
                }
            }
        ])
        .then(async (data) => {
            // res.send(data);
            const new_order = new Order(req.body);

            new_order.orderId = orderId;
            new_order.amount = data[0].total;

    
            const save_order = await new_order.save()
    
            if (save_order) {
                res.json({ "message": "Order Succesfully Added", status: "success", savedOrder: save_order })
            }
        })

        

        


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
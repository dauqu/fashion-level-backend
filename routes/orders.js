const router = require('express').Router();

const Order = require("../models/order_schema");

// get all orders 
router.get('/', async (req, res) => {
    const all_orders = await Order.find({});
    if(all_orders){
        return res.json(all_orders);
    }
})


// get order by id
router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const one_order = await Order.findOne({_id: id});

        if(!one_order){
            return res.status(404).json({message: "order not found", status: "warning"});
        }
        return res.status(200).json({message: "order found", status: "success", order: one_order});
    }
    catch(e){
        return res.status(400).json({message: e.message, status: "error"});
    }
})

//add new order
router.post('/', async (req, res) => {
    try{
        const new_order = new Order(req.body);
        const save_order = await new_order.save()
        
        if(save_order){
            res.json({"message": "Order Succesfully Added", status: "success"})
        }
    }catch{
        res.json({"message": "Order not Added", status: "error"})
    }
    
})

//delete order by id
router.delete("/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const is_order = await Order.findById({_id: id});
        if(!is_order){
            return res.status(404).json({message: "Brand not found", status: "error" })
        }
        await Order.findByIdAndDelete({_id: id});
        return res.status(200).json({ message: "Brand deleted", status: "success" })
    }catch(e){
        res.status(500).json({ message: e.message, status: "error" })
    }
})

//update order by id
router.patch('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const update = req.body;

        const get_order = await Order.findOneAndUpdate({_id: id}, update, {new: false});
        get_order.save();

        return res.status(200).json({message: "Order updated", status: "success"})

    }catch(e){
        return res.status(400).json({message: e.message, status: "error"})
    }

})

module.exports = router;
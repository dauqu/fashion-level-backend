const router = require("express").Router();

const Order = require("../models/order_schema")
const Promo = require("../models/promo_schema")


router.get('/', async (req, res) => {
    const cancelled = await Order.find({status: "cancelled"})
    const processing = await Order.find({status: "pending"})
    const ready = await Order.find({status: "ready"})
    const shipped = await Order.find({status: "shipped"}) 
    const returned_orders = await Order.find({status: "return"}) 
    
    const delivered = await Order.find({status: "delivered"})
    const promo = await Promo.find({});

    const total_orders = await Order.find({})

    let total_items_sold = 0;
    delivered.forEach(element => {
        element.products.length > 0 &&
        element.products.forEach((e) => {
            total_items_sold += e.quantity;
        })
    });

    let total_promo_amount = 0;
    promo.forEach((e) => {
     total_promo_amount += e.net_amount;   
    })


    res.status(200).json({
        order_statistics: {
            cancelled: cancelled.length,
            delivered: delivered.length,
            processing: processing.length,
            ready: ready.length,
            shipped: shipped.length,
            return: returned_orders.length,
            items_sold: total_items_sold,
            promo_amount: total_promo_amount,
            total_orders: total_orders.length,
        }
    })
})

module.exports = router;
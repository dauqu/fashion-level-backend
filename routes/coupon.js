const router = require('express').Router();

const Coupon = require('../models/coupon_schema');
const Cart = require('../models/cart_schema');

// get all coupon by page no 
router.get('/page/:pageNo', async (req, res) => {
    try {
        const { pageNo } = req.params;
        if(Number(pageNo) < 1){
            return res.json({message: "Page number should be greater than 0" ,status: "error" });
        }

        const limit = 10;
        const skip = (pageNo - 1) * limit;

        const coupons = await Coupon.find({}).skip(skip).limit(limit);
        res.json({status: "success" , coupons});
    } catch (err) {
        res.json({ message: err.message });
    }
});

// apply coupon
router.post('/apply/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {cart_id} = req.body;

        const cart = await Cart.findById(cart_id);
        const coupon = await Coupon.findById(id);
        if(cart.price < coupon.minOrderAmount){
            return res.json({message: `Cannot apply on amount below ${coupon.minOrderAmount}` ,status: "error" });
        }

        console.log(cart.price+" "+coupon.discount);
        const discount = (Number(cart.price) * Number(coupon.discount)) / 100;
        
        res.json({message: "Coupon applied success" ,status: "success" , discount});
    } catch (err) {
        res.json({ message: err.message, status: "success" });
    }
});

// get all coupons
router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({status: "success" , coupons});
    } catch (err) {
        res.json({ message: err.message });
    }
});


// add coupon
router.post('/', async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        // generate 10 digit random number
        const random = Math.floor(1000000000 + Math.random() * 9000000000);
        coupon.code = random;

        const savedCoupon = await coupon.save();
        res.json({message: "Coupon saved success" ,status: "success" , savedCoupon});
    } catch (err) {
        res.json({ message: err.message });
    }
});


// delete coupon by id 
router.delete('/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        res.json({message: "Coupon deleted success" ,status: "success" , coupon});
    } catch (err) {
        res.json({ message: err.message });
    }
});



module.exports = router;
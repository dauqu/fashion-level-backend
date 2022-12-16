const router = require('express').Router();

const Coupon = require('../models/coupon_schema');
const Cart = require('../models/cart_schema');
const upload = require('../config/fileuploader');

// get all coupon by page no 
router.get('/page/:pageNo', async (req, res) => {
    try {
        const { pageNo } = req.params;
        if(Number(pageNo) < 1){
            return res.json({message: "Page number should be greater than 0" ,status: "error" });
        }

        const limit = 10;
        const skip = (pageNo - 1) * limit;
        const allCoupons = await Coupon.find({});
        const coupons = await Coupon.find({}).skip(skip).limit(limit);

        let pagination = [];
        for(let i = 1; i <= Math.ceil(allCoupons.length / limit); i++){
            pagination.push(i);
        }

        res.json({status: "success", message: "Coupons Cound", coupons, pagination});
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
router.post('/', upload.single("image"), async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host');

        const coupon = new Coupon(req.body);
        coupon.image = url + '/' +  req.file.filename;

        const savedCoupon = await coupon.save();
        res.status(200).json({message: "Coupon saved success" ,status: "success" , savedCoupon});
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
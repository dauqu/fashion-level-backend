const router = require('express').Router();
const Promo = require('../models/promo_schema');

//get all promo codes
router.get('/', async (req, res) => {
    try{
        const allPromoCodes = await Promo.find({});
        if(allPromoCodes) res.status(200).json(allPromoCodes);
    }catch(e){
        res.status(400).json({ message: e.message, status: "error"})
    }
})

//get promo codes by id
router.get('/:id', async (req, res) => {
    const {id} = req.body;
    try{
        const promoCode = await Promo.findOne({_id: id});
        if(promoCode) res.status(200).json(promoCode);
    }catch(e){
        res.status(400).json({ message: e.message, status: "error"})
    }
})


//add new promo codes
router.post('/', CheckPromoCode, async (req, res) => {
    try{
        const new_promo = new Promo({...req.body, usage: 0, sales: 0});
        await new_promo.save();
        return res.status(200).json({message: "New Promocode created", status: "success"});
    }catch(e){
        res.status(400).json({ message: e.message, status: "error"})
    }
})


//delete promo code by id
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        await Promo.findOneAndDelete({_id: id});
        return res.status(200).json({message: "Promo code deleted.", status: "success"});
    }catch(e){
        res.status(400).json({ message: e.message, status: "error"})
    }
})

//update promo code by id



async function CheckPromoCode(req, res, next){
    const {title, code, net_amount} = req.body;
    if(title === "" || title === null || title === undefined ||
        code === "" || code === null || code === undefined ||
        isNaN(net_amount)
    ){
        return res.status(400).json({message: "Please provide all fields", status: "error"});
    }
    next();

}
module.exports = router;
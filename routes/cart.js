const router = require('express').Router();

const Cart = require("../models/cart_schema");

// get all carts 
router.get('/', async (req, res) => {
    const all_cart_items = await Cart.find();
    if(all_cart_items){
        return res.json(all_cart_items);
    }
})


// get carts by id
router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const one_cart = await Cart.findOne({_id: id});

        if(one_cart){
            return res.status(200).json(one_cart);
        }
    }
    catch(e){
        return res.status(400).json({message: e.message, status: "error"});
    }
})

//add new item to cart
router.post('/', async (req, res) => {
    try{
        // check if same item is already added in user cart 
        const {userId, productId} = req.body;
        const check_cart = await Cart.find({userId, productId});
        if(check_cart.length > 0){
            return res.status(403).json({"message": "Item is alredy added in the cart", status: "warning"})
        } 

        // if not then add
        const new_cart = new Cart(req.body);
        const save_cart = await new_cart.save();
        
        if(save_cart){
            return res.status(200).json({"message": "Item Succesfully Added to cart", status: "success"})
        }
    }catch{
        res.json({"message": "Item not Added to cart", status: "error"})
    }
    
})

//delete cart item by id
router.delete("/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const is_cart_item = await Cart.find({_id: id});
        if(!is_cart_item){
            return res.status(404).json({ message: "Cart not found", status: "error" })
        }
        
        await Cart.deleteOne({_id: id});
        return res.status(200).json({
            message: "Cart Item deleted",
            status: "success"
        })
    }catch(e){
        res.status(500).json({ message: e.message, status: "error" })
    }
})

//update cart ite by id
router.patch('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const update = req.body;

        const get_cart_item = await Cart.findOneAndUpdate({_id: id}, update, {new: false});
        get_cart_item.save();

        return res.status(200).json({message: "Cart Updated Successfully", status: "success"})

    }catch(e){
        return res.status(400).json({message: e.message, status: "error"})
    }

})


module.exports = router;
const { get } = require("mongoose");
const Products = require("../models/products_schema");
const router = require("express").Router();

// get all products 
router.get('/', async (req, res) => {
    try{
        const allProducts = await Products.find({});
        if(allProducts){
            res.status(200).json(allProducts);
        }
    }catch(e){
        res.status(400).json({message: e.message, status: "error"})
    }
})

// get products by id
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const get_product = await Products.findOne({_id: id});
        if(get_product){
            return res.status(200).json({message: "Product Found", status: "success", product: get_product});
        }
    } catch (e) {
        return res.status(400).json({message: "Product Not Found", status: "error"});
    }
})


// add new product 
router.post('/', async (req, res) => {
    try {
        const newproduct = new Products(req.body);
        await newproduct.save();
        return res.status(200).json({message: "Product added successfully", status: "success"})
    } catch (error) {
        return res.status(400).json({message: e.message, status: "error"})
    }
})

// update product by id 
router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Products.findById(id);
        if(!product){
            return res.status(404).json({message: "Product Not found", status: "error"})
        }
        await Products.findByIdAndUpdate(id, req.body, {new: false})
        return res.status(200).json({json: "Product updated", status: "success"})
    } catch (error) {
        return res.status(200).json({message: e.message, status: "error"})
    }
})

// delete product by id 
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product=await Products.findById(id);
        if(!product){
            return res.status(404).message({message: "Product Not found", status: "error"})
        }
        await Products.findByIdAndDelete(id);
        return res.status(200).json({message: "Product deleted", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})
module.exports = router;
const { get } = require("mongoose");
const Products = require("../models/products_schema");
const router = require("express").Router();


//get all products with store and brand details (filter: status)
router.get('/full/page/:status/:page_no', async (req, res) => {
    try{
        const {status, page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0) {
            return res.status(404).json({message: "Invalid page no.", status: "warning"})
        }

        let toSkip = (PageNo-1)*10;
        const allProducts = await Products.find({status}).populate([
            {
                path: "store"
            },
            {
                path: "brand"
            }
        ]).skip(toSkip).limit(10);


        
        if(allProducts.length <= 0){
            res.status(200).json({message: "NO Products found", status: "warning"});
        }
        let all_pages = [];
        for (let i = 1; i <= Math.ceil(allProducts.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({message: "Products found", status: "success",  data: allProducts, pagination: all_pages});
    }catch(e){
        res.status(500).json({message: e.message, status: "error"})
    }
});


//get all products with store and brand details
router.get('/full/page/:page_no', async (req, res) => {
    try{
        const {page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0) {
            return res.status(400).json({message: "Invalid page no.", status: "warning"})
        }

        let toSkip = (PageNo-1)*10;
        const allProducts = await Products.find({}).populate([
            {
                path: "store"
            },
            {
                path: "brand"
            }
        ]).skip(toSkip).limit(10);


        
        if(allProducts.length <= 0){
            res.status(200).json({message: "NO Products found", status: "warning"});
        }
        let all_pages = [];
        for (let i = 1; i <= Math.ceil(allProducts.length / 10); i++) {
            all_pages.push(i);
        }
        res.status(200).json({message: "Products found", status: "success",  data: allProducts, pagination: all_pages});
    }catch(e){
        res.status(400).json({message: e.message, status: "error"})
    }
});

//get all products with store and brand details
router.get('/full', async (req, res) => {
    try{
        const allProducts = await Products.find({}).populate([
            {
                path: "store"
            },
            {
                path: "brand"
            }
        ]);
        if(allProducts.length <= 0){
            res.status(200).json({message: "NO Products found", status: "warning"});
        }
        res.status(200).json({message: "Products found", status: "success",  data: allProducts});
    }catch(e){
        res.status(400).json({message: e.message, status: "error"})
    }
});



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
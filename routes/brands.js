const router = require('express').Router();

const Brand = require("../models/brand_schema");

// get all brands 
router.get('/', async (req, res) => {
    const all_brands = await Brand.find();
    if(all_brands){
        return res.json(all_brands);
    }
})


// get brand by id
router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const one_brands = await Brand.findOne({_id: id});

        if(one_brands){
            return res.status(200).json(one_brands);
        }
    }
    catch(e){
        return res.status(400).json({message: e.message, status: "error"});
    }
})

//add new brand
router.post('/',checkBrand, async (req, res) => {
    try{
        const newbrand = new Brand(req.body);
        const save_brand = await newbrand.save()
        
        if(save_brand){
            res.json({"message": "Brand Succesfully Added", status: "success"})
        }
    }catch{
        res.json({"message": "Brands not Added", status: "error"})
    }
    
})

//delete brand by id
router.delete("/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const is_brand = await Brand.find({_id: id});
        if(!is_brand)
            return res.status(404).json({
                message: "Brand not found",
                status: "error"
            })
        await Brand.deleteOne({_id: id});
        return res.status(200).json({
            message: "Brand deleted",
            status: "success"
        })
    }catch(e){
        res.status(404).json({
            message: e.message,
            status: "error"
        })
    }
})

//update brand by id
router.patch('/update/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const update = req.body;

        const get_brand = await Brand.findOneAndUpdate({_id: id}, update, {new: false});
        get_brand.save();

        return res.status(200).json({message: "Brand Updated", status: "success"})

    }catch(e){
        return res.status(400).json({message: e.message, status: "error"})
    }

})



async function checkBrand(req, res, next) {
    const {name, storeId, banner } = req.body;
    if(name === "" ||
    storeId === "" ||
    banner === "" ||
    name === null ||
    storeId === null ||
    banner === null ||
    name === undefined ||
    storeId === undefined ||
    banner === undefined){
        return res
        .status(400)
        .json({ message: "Please fill all fields", status: "warning" });    
    }
    next();
}
module.exports = router;
const router = require('express').Router();

const upload = require('../config/fileuploader');
const Brand = require("../models/brand_schema");
const Product = require("../models/products_schema");

//get total brands count

router.get('/count', async (req, res) => {
    try {
        const all_brands = await Brand.find();
        const publish = all_brands.filter(brand => brand.status === 'publish').length;
        const unpublish = all_brands.filter(brand => brand.status === 'unpublish').length;

        return res.status(200).json({ message: "Brands available", status: "success", data: {
            all_brands: all_brands.length, 
            publish,
            unpublish
        }});
    
    } catch (error) {
        res.status(200).json({ message: error.message, status: "error" });
    }
})


// get brand by status and page no 
router.get('/page/:status/:page_no', async (req, res) => {
    try {
        const { status, page_no } = req.params;
        
        let PageNo = Number(page_no);
        if (PageNo <= 0) return res.status(400).json({ message: "Invalid page no", status: "warning" })

        let toSkip = (PageNo - 1) * 10;
        const all_brands = await Brand.find({ status });

        const page_brands = await Brand.find({ status }).skip(toSkip).limit(10);
        
        let pagination = [];
        for (let i = 1; i <= Math.ceil(all_brands.length / 10); i++) {
            pagination.push(i);
        }
        return res.status(200).json({ message: "Brands available", status: "success", all_brands: page_brands, totalbrand: all_brands.length, pagination });
    } catch (error) {
        res.status(200).json({ message: error.message, status: "error" });
    }
})




// get all brands 
router.get('/page/:page_no', async (req, res) => {
    try {
        const { page_no } = req.params;

        let PageNo = Number(page_no);
        if (PageNo <= 0) return res.status(400).json({ message: "Invalid page no", status: "warning" })

        let toSkip = (PageNo - 1) * 10;
        const all_brands = await Brand.find();
        const page_brands = await Brand.find().skip(toSkip).limit(10);


        let pagination = [];
        for (let i = 1; i <= Math.ceil(all_brands.length / 10); i++) {
            pagination.push(i);
        }
        return res.status(200).json({ message: "Brands available", status: "success", all_brands: page_brands, totalbrand: all_brands.length, pagination });
    } catch (error) {

    }
})

//  get all brands 
router.get('/', async (req, res) => {
    const all_brands = await Brand.find();
    if (all_brands) {
        return res.json(all_brands);
    }
})


// get brand by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const one_brands = await Brand.findOne({ _id: id });

        if (one_brands) {
            return res.status(200).json(one_brands);
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message, status: "error" });
    }
})

//add new brand
router.post('/', upload.single("banner"), async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        // console.log(req.body.name);
        // console.log(req.file.filename);

        const newbrand = new Brand({
            name: req.body.name,
            banner: url + '/' + req.file.filename
        });
        const save_brand = await newbrand.save()

        if (save_brand) {
            res.json({ "message": "Brand Succesfully Added", status: "success" })
        }
    } catch (e) {
        res.json({ "message": e.message, status: "error" })
    }

})

//delete brand by id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const is_brand = await Brand.find({ _id: id });
        if (!is_brand)
            return res.status(200).json({
                message: "Brand not found",
                status: "warning"
            })

        const find_products = await Product.find({ brand: id });
        if(find_products.length > 0)
            return res.status(200).json({ message: "Cannot Delete Brand, First delete all products related to it.", status: "warning" })

        await Brand.deleteOne({ _id: id });
        return res.status(200).json({
            message: "Brand deleted",
            status: "success"
        })
    } catch (e) {
        res.status(404).json({
            message: e.message,
            status: "error"
        })
    }
})

//update brand by id
router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const get_brand = await Brand.findOneAndUpdate({ _id: id }, update, { new: false });
        get_brand.save();

        return res.status(200).json({ message: "Brand Updated", status: "success" })

    } catch (e) {
        return res.status(400).json({ message: e.message, status: "error" })
    }

})



async function checkBrand(req, res, next) {
    const { name, storeId, banner } = req.body;
    if (name === "" ||
        name === null ||
        name === undefined) {
        return res
            .status(400)
            .json({ message: "Please fill all fields", status: "warning" });
    }
    next();
}
module.exports = router;
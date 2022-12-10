const Banner = require('../models/banners_schema');
const express = require('express');
const router = express.Router();
const upload = require('../config/fileuploader');
//get all banners by page no
router.get('/page/:page_no', async (req, res) => {
    try {
        const { page_no } = req.params;
        let PageNo = Number(page_no);
        if (PageNo <= 0) return res.status(400).json({ message: "Invalid page no", status: "warning" })
        
        
        let toSkip = (PageNo - 1) * 10;
        const allBanners = await Banner.find().skip(toSkip).limit(10);
        if (allBanners.length <= 0) {
            return res.status(200).json({ message: "No banners", status: "warning", allBanners: [], pagination: [] });
        }

        let pagination = [];
        for (let i = 1; i <= Math.ceil(allBanners.length / 10); i++) {
            pagination.push(i);
        }
        return res.status(200).json({ message: "Banners available", status: "success", allBanners, pagination });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: "error" });
    }
})



// get all the banners 
router.get('/', async (req, res) => {
    try {
        const allBanners = await Banner.find();
        res.status(200).json({ data: allBanners, status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});


// create a new banner 
router.post('/', upload.single("image"), async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host');

        const banner = new Banner({
            title: req.body.title,
            image: url + '/' + req.file.filename,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            status: req.body.status
        });
        const newBanner = await banner.save();
        res.status(201).json({ data: newBanner, status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});


// update banner by banner id 
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const findBanner = await Banner.findById(id);
        if(!findBanner){
            return res.status(404).json({ message: "Banner not found", status: "error" });
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, update);
        updatedBanner.save();
        res.status(200).json({ message: "Banner updated", status: "success"})
    }catch(e){
        res.status(400).json({ message: e.message, status: "error" });
    }
})

// delete a banner by id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findBanner = await Banner.findById(id);

        if (!findBanner) {
            return res.status(404).json({ message: "Banner not found", status: "error" });
        }
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: "Banner deleted", status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});


module.exports = router;
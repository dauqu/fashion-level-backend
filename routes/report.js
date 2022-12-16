const router = require('express').Router();
const Report = require('../models/report_schema')

//get report by page no
router.get('/page/:page_no', async (req, res) => {
    try {
        const {page_no} = req.params;
        let page = parseInt(page_no);
        if (page <= 0) {
            return res.status(200).json({ message: "Invalid page no", status: "error" });
        }
        let all = await Report.find();
        const report = await Report.find().skip((page_no - 1) * 10).limit(10);

        let pagination = []
        let total_pages = Math.ceil(all.length / 10);
        for (let i = 1; i <= total_pages; i++) {
            pagination.push(i);
        }

        if (!report) {
            return res.status(404).json({
                 message: "Report not found", status: "error", 
                 pagination: pagination, 
                 report
        });
        }
        res.status(200).json({ message: "Report found", status: "success", report });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});



//Get all reports
router.get('/', async (req, res) => {
    try {
        const all_report = await Report.find();
        res.status(200).send(all_report);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//Get report by id
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found", status: "error" });
        }
        res.status(200).json({ message: "Report found", status: "success", report });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


//Create new report
router.post('/', async (req, res) => {
    
    try {
        const new_report = new Report(req.body);
        await new_report.save();
        res.status(201).json({ message: "Report created", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

// Update report by ID 
router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_report = await Report.findById(id);
        if(!find_report){
            return res.status(404).json({message: "Report not found", status: "error"})
        }
        await Report.findByIdAndUpdate(id, req.body);
        return res.status(200).json({message: "Report updated", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_Report = await Report.findById(id);
        if(!find_Report){
            return res.status(404).json({message: "Report not found", status: "error"})
        }
        await Report.findByIdAndDelete(id, req.body);
        return res.status(200).json({message: "Report deleted", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})

module.exports = router;
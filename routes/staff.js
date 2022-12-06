const router = require('express').Router();
const Staff = require('../models/staff_schema')
const bcrypt = require('bcryptjs')

//Get all staff by page no
router.get('/page/:page_no', async (req, res) => {
    try {
        const { page_no } = req.params;
        let PageNo = Number(page_no);
        if (PageNo <= 0) {
            return res.status(404).json({ message: "Invalid page no.", status: "warning" })
        }

        let toSkip = (PageNo - 1) * 10;
        const allStaffs = await Staff.find({ }).skip(toSkip).limit(10);

        if (allStaffs.length <= 0) {
            return res.status(200).json({ message: "No staff found", status: "warning" });
        }
        let all_pages = [];
        for (let i = 1; i <= Math.ceil(allStaffs.length / 10); i++) {
            all_pages.push(i);
        }
        return res.status(200).json({ message: "Staff found", status: "success", data: allStaffs, pagination: all_pages });
    } catch (e) {
        res.status(500).json({ message: e.message, status: "error" })
    }
});

//Get all staff
router.get('/', async (req, res) => {
    try {
        const all_staff = await Staff.find();
        res.status(200).send(all_staff);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//Get staff by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found!", status: "error" });
        }
        res.status(200).json({ message: "Staff found", status: "success", staff });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


//Create new staff
router.post('/', async (req, res) => {

    try {
        const { name, password, email, mobile_no, role } = req.body;
        const hashed_password = await bcrypt.hash(password, 10);

        const new_staff = new Staff({
            name,
            email,
            password: hashed_password,
            mobile_no,
            role
        });
        await new_staff.save();
        res.status(201).json({ message: "Staff Added", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

// Update staff by ID 
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const find_staff = await Staff.findById(id);
        if (!find_staff) {
            return res.status(404).json({ message: "Staff not found", status: "error" })
        }
        await Staff.findByIdAndUpdate(id, req.body);
        return res.status(200).json({ message: "Staff details updated", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "error" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const find_staff = await Staff.findById(id);
        if (!find_staff) {
            return res.status(404).json({ message: "Staff not found", status: "error" })
        }
        await Staff.findByIdAndDelete(id, req.body);
        return res.status(200).json({ message: "Staff deleted", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "error" })
    }
})




module.exports = router;
const Roles= require("../models/roles_schema")

const router = require("express").Router();

//Get all roles
router.get("/", async (req, res) => {
    try {
        const all_roles = await Roles.find();
        res.status(200).json({all_roles, message: "Roles found", status: "success"});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


// create new staff roles
router.post("/:for_type", async (req, res) => {
    try {
        const { for_type } = req.params;
        const { role } = req.body;

        let valid_for = ["staff"];
        if(!valid_for.includes(for_type)){
            return res.status(400).json({ message: "Invalid Role type", status: "error" });
        }

        const new_roles = new Roles({
            role: role,
            for: for_type
        });
        await new_roles.save();
        res.status(201).json({ message: "Roles Added", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


// get all role for (Filter)
router.get("/for/:filter", async (req, res) => {
    try {
        const { filter } = req.params;
        const all_roles = await Roles.find({for: filter});
        res.status(200).json({all_roles, message: "Roles found", status: "success"}); 
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//get all role by page_no (filter: for)
router.get("/for/:filter/:page_no", async (req, res) => {
    try {
        const { filter, page_no } = req.params;
        let PageNo = parseInt(page_no);
        if(PageNo < 1) {
            return res.status(400).json({ message: "Page number must be greater than 0", status: "error" });
        }
        const all_for = await Roles.find({for: filter});

        const all_roles = await Roles
            .find({for: filter})
            .skip((PageNo - 1) * 3)
            .limit(3);

        let pagination = [];
        for(let i = 1; i <= Math.ceil(all_for.length / 3); i++) {
            pagination.push(i);
        }

        res.status(200).json({all_roles, pagination, message: "Roles found", status: "success"});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});



module.exports = router;
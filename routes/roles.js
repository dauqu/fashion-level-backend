const Roles= require("../models/roles_schema")

const router = require("express").Router();

//Get roles info by id
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const role = await Roles.findById(id);
        res.status(200).json({role, message: "Roles found", status: "success"});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

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
            return res.status(302).json({ message: "Invalid Role type", status: "warning" });
        }
        // check role already exists 
        const check_roles = await Roles.findOne({role: role});
        if(check_roles){
            return res.status(200).json({message: "Role already exist", status: "warning"})
        }
        const new_roles = new Roles(req.body);
        new_roles.for = for_type;
        new_roles.role = role;
        await new_roles.save();
        res.status(201).json({ message: "Roles Added", status: "success", role_info: new_roles});
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
            .skip((PageNo - 1) * 10)
            .limit(10);

        let pagination = [];
        for(let i = 1; i <= Math.ceil(all_for.length / 10); i++) {
            pagination.push(i);
        }

        res.status(200).json({all_roles, pagination, message: "Roles found", status: "success"});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

// update role info
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // update role
        const update = await Roles.findByIdAndUpdate(id, req.body);
        if(!update){
            return res.status(404).json({ message: "Role not found", status: "warning" });
        }
        res.status(200).json({ message: "Role updated", status: "success", role_info: update});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

// delete role by id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delete_role = await Roles.findByIdAndDelete(id);
        if(!delete_role){
            return res.status(404).json({ message: "Role not found", status: "warning" });
        }
        res.status(200).json({ message: "Role deleted", status: "success", role_info: delete_role});
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});




module.exports = router;
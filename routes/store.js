const Store = require("../models/store_schema")
const router = require("express").Router();


//count all store by status
router.get("/count", async (req, res) => {
    try{
        const all = await Store.find({});
        const active = all.filter((store) => store.status === "active");
        const pending = all.filter((store) => store.status === "pending");
        const blocked = all.filter((store) => store.status === "blocked");
        const rejected = all.filter((store) => store.status === "rejected");

        return res.status(200).json({message: "Stores found", status: "success",  data: {
            all: all.length,
            active: active.length,
            pending: pending.length,
            blocked: blocked.length,
            rejected: rejected.length
        }});
    }catch(e){
        res.status(500).json({message: e.message, status: "error"})
    }
})



// get stores by page no (filter: status)
router.get("/page/:status/:page_no", async (req, res) => {
    try{
        const {status, page_no} = req.params;
        let PageNo = Number(page_no);
        if(PageNo <= 0) {
            return res.status(400).json({message: "Invalid page no.", status: "warning"})
        }

        let toSkip = (PageNo-1)*10;
        const all = await Store.find({status});
        const allStore = await Store.find({status}).skip(toSkip).limit(10);
        
        let all_pages = [];
        for (let i = 1; i <= Math.ceil(all.length / 10); i++) {
            all_pages.push(i);
        }

        if(allStore.length <= 0){
            return res.status(202).json({message: "NO stores found", status: "warning", data: [], pagination: all_pages});
        }
        return res.status(200).json({message: "Stores found", status: "success",  data: allStore, pagination: all_pages});
    }catch(e){
        res.status(500).json({message: e.message, status: "error"})
    }
})

// get all stores store 
router.get("/", async (req, res) => {
    try {
        const allStore = await Store.find({});
        return res.status(200).json(allStore)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

// get store by id 
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const store = await Store.findById(id);
        if(!store){
            return res.status(404).json({message: "store not found", status: "warning"})
        }
        return res.status(200).json({message: "store found", status: "success", store: store});
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

// add new store
router.post("/", async (req, res) => {
    try {
        const newstore = new Store(req.body);
        await newstore.save();
        return res.status(200).json({message: "store added", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

// update store by id
router.patch("/:id", async (req, res) => {
    try {
        const {id}=req.params;

        const find_store = await Store.findById(id);
        if(!find_store){
            return res.status(404).json({message: "store not found", status: "warning"})
        }
        await Store.findByIdAndUpdate(id, req.body, {new: false});
        return res.status(200).json({message: "store updated", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

//delete store by id
router.delete("/:id", async (req, res) => {
    try {
        const {id}=req.params;

        const find_store = await Store.findById(id);
        if(!find_store){
            return res.status(404).json({message: "store not found", status: "warning"})
        }
        await Store.findByIdAndDelete(id);
        return res.status(500).json({message: "store deleted", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

module.exports = router;



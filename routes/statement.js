const router = require('express').Router();
const Statement = require('../models/statement_schema')


//Get all post
router.get('/', async (req, res) => {
    try {
        const statement = await Statement.find();
        res.status(200).send(statement);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//Get post by id
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const statement = await Statement.findById(id);
        if (!statement) {
            return res.status(404).json({ message: "Statement not found", status: "error" });
        }
        res.status(200).json({ message: "Statement found", status: "success", statement });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


//Create new post
router.post('/', async (req, res) => {
    
    try {
        const newStatement = new Statement(req.body);
        await newStatement.save();
        res.status(201).json({ message: "Statement created", status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

// Update post by ID 
router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_statement = await Statement.findById(id);
        if(!find_statement){
            return res.status(404).json({message: "Statement not found", status: "error"})
        }
        await Statement.findByIdAndUpdate(id, req.body);
        return res.status(200).json({message: "Statement updated", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_statement = await Statement.findById(id);
        if(!find_statement){
            return res.status(404).json({message: "Statement not found", status: "error"})
        }
        await Statement.findByIdAndDelete(id, req.body);
        return res.status(200).json({message: "Statement deleted", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})




module.exports = router;
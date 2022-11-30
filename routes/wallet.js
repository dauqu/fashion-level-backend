const router = require('express').Router();
const Wallet = require('../models/wallet_schema')


//Get all wallets
router.get('/', async (req, res) => {
    try {
        const wallet = await Wallet.find();
        res.status(200).send(wallet);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//Get wallet by id
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const wallet = await Wallet.findById(id);
        if (!wallet) {
            return res.status(404).json({ message: "Invalid Wallet", status: "error" });
        }
        res.status(200).json({ message: "Wallet found", status: "success", wallet });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


//Create new wallet
router.post('/', async (req, res) => {
    
    try {
        const newWallet = new Wallet(req.body);
        await newWallet.save();
        res.status(201).json({ message: "Wallet created", status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

// Update post by ID 
router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_Wallet = await Wallet.findById(id);
        if(!find_Wallet){
            return res.status(404).json({message: "Invalid wallet", status: "error"})
        }
        await Wallet.findByIdAndUpdate(id, req.body);
        return res.status(200).json({message: "Wallet updated", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_Wallet = await Wallet.findById(id);
        if(!find_Wallet){
            return res.status(404).json({message: "Invalid Wallet", status: "error"})
        }
        await Wallet.findByIdAndDelete(id, req.body);
        return res.status(200).json({message: "Wallet deleted", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})




module.exports = router;
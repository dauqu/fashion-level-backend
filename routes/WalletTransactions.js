const router = require("express").Router();
const WalletTransactions = require("../models/wallet_transaction_schema");


//get all transactions
router.get("/", async (req, res) => {
    try {
        const all_transactions = await WalletTransactions.find();
        return res.status(200).json({message: "All transactions loaded", status: "success", all_transactions})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

//create new transaction 
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const new_transaction = new WalletTransactions(data);
        await new_transaction.save();
        return res.status(200).json({message: "Transactions created", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

//update transaction by id 
router.patch("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const find_wallet_transactions = await WalletTransactions.findById(id);
        if(!find_wallet_transactions){
            return res.status(404).json({message: "Transactions not found", status: "warning"})
        }
        const update_transaction = WalletTransactions.findByIdAndUpdate(id, data, {new: false});
        
        await update_transaction.save();
        return res.status(200).json({message: "Transactions updated successfully", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})

//delete transaction by id 
router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const find_wallet_transactions = await WalletTransactions.findById(id);
        if(!find_wallet_transactions){
            return res.status(404).json({message: "Transactions not found", status: "warning"})
        }
        await WalletTransactions.findByIdAndDelete(id);
        return res.status(200).json({message: "Transactions deleted successfully", status: "success"})
    } catch (e) {
        return res.status(500).json({message: e.message, status: "error"})
    }
})


module.exports = router;
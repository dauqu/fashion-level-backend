const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Payment = require("../models/payment_schama")

//get all payment by page no
router.get('/page/:page_no', async (req, res) => {
    try {
        let page_no = req.params.page_no;
        page_no = Number(page_no);
        
        if (!page_no || page_no <= 0) {
            return res.status(205).json({ message: "Invalid page", status: "warning" })
        }

        //skip and limit by page no
        let toSkip = (page_no - 1) * 10;
        const payments = await Payment.find({}).skip(toSkip).limit(10);

        // calculating pagination array 
        let pagination = [];
        for (let i = 1; i <= Math.ceil(payments.length); i++) {
            pagination.push(i);
        }
        return res.status(200).json({ message: "Payment details fetched", status: "success", payments, pagination })
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" })
    }
})


router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find({});
        return res.status(200).json({ message: "Payment details fetched", status: "success", payments })
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" })
    }
})

router.post('/', async (req, res) => {
    try {
        const { user, mode, status, amount } = req.body;
        if (!mongoose.isValidObjectId(user)) {
            return res.status(400).json({ message: "Invalid User", status: "warning" })
        }

        const new_payment = new Payment({
            user, mode, status, amount
        });
        await new_payment.save();
        return res.status(200).json({ message: "Payment details added", status: "success" })
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" })
    }
})



module.exports = router;
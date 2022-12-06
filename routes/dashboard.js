const router = require("express").Router();

const Order = require("../models/order_schema")
const Promo = require("../models/promo_schema")
const User = require("../models/user_schema")
const Store = require("../models/store_schema")
const Brand = require("../models/brand_schema")
const Products = require("../models/products_schema")

//fectch top users with page no *10
router.get("/top-users/:page_no", async (req, res) => {
    try {
        let {page_no} = req.params;
        page_no = Number(page_no);
        
        
        if(page_no < 0) {
            return res.status(403).json({message: "Invalid page number", status: "warning"});
        }
        const toSkip = (page_no - 1)*10;

        const total_users = await User.find({});
        const users_most_order = await User.find({}).sort({total_orders: -1}).skip(toSkip).limit(10);
        
        if(total_users.length <= 0){
            return res.status(404).json({message: "No Users found", status: "warning" });
        }
        let pagination_array = [];
        for(let i=1; i <= Math.ceil(total_users.length/10); i++){
            if(i > 10) break;
            pagination_array.push(i);
        }
        return res.status(200).json({
            message: "Loaded", status: "success", 
            total_users: total_users.length, 
            top_users: users_most_order,
            pagination_array
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message, status: "error"
        });
    }
})

// get most ordered products with page no - *10
router.get("/most-ordered/:page_no", async (req, res) => {
    try {
        let {page_no} = req.params;
        page_no = Number(page_no);
        
        
        if(page_no < 0) {
            return res.status(403).json({message: "Invalid page number", status: "warning"});
        }
        const toSkip = (page_no - 1)*10;
        const total_products = await Products.find({});
        const most_ordered = await Products.find({}).sort({total_orders: -1}).skip(toSkip).limit(10);
        
        if(total_products.length <= 0){
            return res.status(404).json({message: "No Products found", status: "warning" });
        }

        let pagination_array = [];
        for(let i=1; i <= Math.ceil(total_products.length/10); i++){
            if(i > 10) break;
            pagination_array.push(i);
        }

        return res.status(200).json({
            message: "Loaded", status: "success", 
            total_stores: total_products.length, 
            most_ordered,
            pagination_array
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message, status: "error"
        });
    }
})

//get most popular store (most product selling) by page no - 10* 
router.get("/most-popular-store/:page_no", async (req, res) => {
    try {
        let {page_no} = req.params;
        page_no = Number(page_no);


        if(page_no < 0) {
            return res.status(403).json({message: "Invalid page number", status: "warning"});
        }

        const toSkip = (page_no - 1)*10;
        const total_stores = await Store.find({});
        const most_popular_stores = await Store.find({}).sort({quantity_sold: -1}).skip(toSkip).limit(10);
        
        if(total_stores.length <= 0){
            return res.status(404).json({message: "No Popular Stores found", status: "warning" });
        }
        
        let pagination_array = [];
        for(let i=1; i <= Math.ceil(total_stores.length/10); i++){
            if(i > 10) break;
            pagination_array.push(i);
        }
        
        return res.status(200).json({
            message: "Loaded", status: "success", 
            total_stores: total_stores.length, 
            most_popular_stores,
            pagination_array
        });
        
    } catch (e) {
        return res.status(500).json({
            message: e.message, status: "error"
        });
    }
})

router.get('/most-selling/:page_no', async (req, res) => {
    try {
        
        let {page_no} = req.params;
        page_no = Number(page_no);

        if(page_no <= 0) {
            return res.status(403).json({message: "Invalid Page Number", status: "warning"});
        }
        
        const toSkip = (page_no - 1)*10;
        const total_products = await Products.find({});
        const most_selling = await Products.find().sort({quantity_sold: -1}).limit(10).skip(toSkip);

        if(total_products.length <= 0){
            return res.status(404).json({message: "No Products", status: "warning" });
        }

        let page_number_arr = [];
        for(let i=1; i <= Math.ceil(total_products.length/10); i++){
            if(i > 10) break;
            page_number_arr.push(i);
        }
        return res.status(200).json({
            message: "Loaded", status: "success", 
            total_products: total_products.length,
            pagination_array: page_number_arr,
            most_selling 
        });

        } catch (e) {
            return res.status(500).json({message: e.message, status: "error"});
        }   
})

router.get('/', async (req, res) => {
    const total_orders = await Order.find({})
    const cancelled_orders = total_orders.filter((item) => item.status === "cancelled");
    const delivered_orders = total_orders.filter((item) => item.status === "delivered");
    const processing_orders = total_orders.filter((item) => item.status === "pending");
    const ready_orders = total_orders.filter((item) => item.status === "ready");
    const shipped_orders = total_orders.filter((item) => item.status === "shipped");
    const returned_orders = total_orders.filter((item) => item.status === "shipped");

    const all_promo = await Promo.find({});

    const total_users = await User.find({})
    let user_disabled = total_users.filter((user) => user.status === "disabled").length;

    const total_stores = await Store.find({});
    const pending_stores = total_stores.filter((store) => store.status === "pending").length;
    const disabled_stores = total_stores.filter((store) => store.status === "disabled").length;
    const rejected_stores = total_stores.filter((store) => store.status === "rejected").length;
    const offline_stores = total_stores.filter((store) => store.status === "offline").length;

    const total_brands = await Brand.find({});

    let total_items_sold = 0;
    delivered_orders.forEach(element => {
        element.products.length > 0 &&
        element.products.forEach((e) => {
            total_items_sold += e.quantity;
        })
    });

    let total_promo_amount = 0;
    all_promo.forEach((e) => {
     total_promo_amount += e.net_amount;   
    })


    res.status(200).json({
        order_statistics: {
            cancelled: cancelled_orders.length,
            delivered: delivered_orders.length,
            processing: processing_orders.length,
            ready: ready_orders.length,
            shipped: shipped_orders.length,
            return: returned_orders.length,
            items_sold: total_items_sold,
            promo_amount: total_promo_amount,
            total_orders: total_orders.length,
        },
        store_statistics: {
            total_users: total_users.length,
            user_disabled,
            total_stores: total_stores.length,
            pending_stores,
            disabled_stores,
            rejected_stores,
            offline_stores,
            total_brands: total_brands.length
        }
    })
})

module.exports = router;
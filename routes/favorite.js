const Favorite = require('../models/favorite_schema');
const getUserDetails = require('../config/getuserdetails');
const tokenIsValid = require('../config/TokenIsValid');
const router = require("express").Router();

// get all favorite 
router.get('/', tokenIsValid, async (req, res) => {
   try{
        const token = req.headers['x-auth-token'] || req.cookies.auth_token || req.body.token;
        const user = getUserDetails(res, token);
        
        // Get user details by id
        const all_favorite = await Favorite.find({userId: user.id});
        return res.status(200).json(all_favorite);
    }catch(e){
        return res.status(500).json({message: e.message, status: "error"})
    }
})

//add as a favorite item
router.post('/', tokenIsValid,  async (req, res) => {
    try{
        const new_favorite = new Favorite(req.body);
        const save_favorite = await new_favorite.save()
        
        if(save_favorite){
            res.json({"message": "Added to favorite list", status: "success"})
        }
    }catch{
        res.json({"message": "Can't add in favorite list", status: "error"})
    }
    
})

//remove favorite list
router.delete("/:id", tokenIsValid, async (req, res) => {
    try{
        const {id} = req.params;
        const is_favorite = await Favorite.findById(id);
        if(!is_favorite){
            return res.status(404).json({ message: "Not in the favorite list", status: "warning" })
        }
        
        await Favorite.deleteOne({_id: id});
        return res.status(200).json({
            message: "Removed from the Favorite list.",
            status: "success"
        })
    }catch(e){
        res.status(500).json({
            message: e.message,
            status: "error"
        })
    }
})



module.exports = router
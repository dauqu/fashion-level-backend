const router = require('express').Router();
const Post = require('../models/post_schema')


//Get all post
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

//Get post by id
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found", status: "error" });
        }
        res.status(200).json({ message: "Post found", status: "success", post: post });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


//Create new post
router.post('/', async (req, res) => {
    const post = new Post(req.body);

    try {
        const newPost = await post.save();
        res.status(201).json({ message: "Post created", status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

// Update post by ID 
router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_post = await Post.findById(id);
        if(!find_post){
            return res.status(404).json({message: "Post not found", status: "error"})
        }
        await Post.findByIdAndUpdate(id, req.body);
        return res.status(200).json({message: "Post updated", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const find_post = await Post.findById(id);
        if(!find_post){
            return res.status(404).json({message: "Post not found", status: "error"})
        }
        await Post.findByIdAndDelete(id, req.body);
        return res.status(200).json({message: "Post deleted", status: "success"})
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"})
    }
})




module.exports = router;
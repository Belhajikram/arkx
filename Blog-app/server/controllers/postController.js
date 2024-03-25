const Post = require('../models/postSchema');
const mongoose = require('mongoose');


const getAll = async (req, res) => {
    try {
        let query = {};
        
        if (req.query.author) {
            if (typeof req.query.author !== 'string' || req.query.author.trim() === '') {
                return res.status(400).json({ message: "Invalid Author" });
            }
            query.author = req.query.author;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.startDate && req.query.endDate) {
            query.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

         const page = parseInt(req.query.page) || 1; 
         const limit = parseInt(req.query.limit) || 10; 
         const skip = (page - 1) * limit;
 
         const totalCount = await Post.countDocuments(query);
         const totalPages = Math.ceil(totalCount / limit);
 
         const posts = await Post.find(query)
             .skip(skip)
             .limit(limit);
 
         res.status(200).json({
             posts,
             currentPage: page,
             totalPages,
             totalItems: totalCount
         });    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error"});
    }
}



const getById = async (req, res) => {
    try {
        const postId = req.params.id; 
                
        const post = await Post.findById(postId); 
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error"})
    }
}

const createPost = async (req, res) => {
    try {
        const { title, author, category, description } = req.body;
        const newPost = new Post({ title, author, category, description });
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


const updatePost = async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated){
            res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });       
    }
}

const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted){
           return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });       
    }
}


module.exports = {
    getAll,
    getById,
    createPost,
    updatePost,
    deletePost
};

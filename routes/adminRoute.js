const express = require('express')
const router = express.Router()
const User = require("../models/userModel");
const UserPost = require("../models/postModel");
router.get('/getAllUsers', async (req, res) => {
    try {
        
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        
    }
})
router.get('/getAllPosts', async (req, res) => {
    try {
        const posts = await UserPost.find().populate('userId' ,'user_name profileImage email block')
        .sort({createdAt:-1});
     
 
       
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
    }
})
router.patch('/updateBlock', async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        user.block = !user.block
        await user.save()
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error);
    }
})
router.patch('/blockPost', async(req, res) => {
    try {
        const posts = await UserPost.findOne({ _id: req.body.postId })
        posts.block = !posts.block
        await posts.save()
        res.status(200).json({success:true})
    } catch (error) {
        res.status(400).json({success:false})
        
        console.log(error);
    }
})
router.get('/getReports', async (req, res) => {
    try {
        const reportsPosts = await UserPost.find({ reports: { $exists: true } }).populate('reports', 'user_name profileImage email ').populate('userId', 'user_name profileImage email ')
        res.status(200).json(reportsPosts)
    } catch (error) {
        res.status(400).json({success:false})
        
    }
})


module.exports = router;
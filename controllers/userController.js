const User = require("../models/userModel");
const UserPost = require("../models/postModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userHelpers = require("../helpers/userHelpers");
const { response } = require("express");
const { default: mongoose } = require("mongoose");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const userExist = await User.findOne({ email: req.body.email });
      
      if (userExist) {
        return res
          .status(200)
          .json({ message: "user Alredy Existed", success: false });
      } else {
        userHelpers.doSMS(req.body).then((response) => {
          if (response.smsError) {
            res.status(401).json({ message: "not", success: false });
          } else {
            res.status(200).json({ message: "redirect to otp", success: true });
          }
        });
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  otp: async (req, res, next) => {
    try {
      userHelpers.otpVerify(req.body).then(async (response) => {
        if (response.varificeationError) {
          res
            .status(400)
            .json({ message: "OTP varification failed", success: false });
        } else {
          // res.status(200).json({message:'success',success:true})
          const userData = req.body.location.state;

          const password = userData.password;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          userData.password = hashedPassword;
          const new_user = new User(userData);
          await new_user.save();

          const user = await User.findOne({ email: userData.email });

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });

          res
            .status(200)
            .json({
              message: "Your account created",
              success: true,
              token: token,
            });
        }
      });
    } catch (error) {
      res.ststus(500).json(error)
    }
  },
  login: async (req, res, next) => {
    console.log("hello");
    try {
      const user = await User.findOne({ email: req.body.email });
   
    if (!user) {
      return res
        .status(200)
        .json({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Password is incorrect", success: false });
    } else {
      const user = await User.findOne({ email: req.body.email });
      if (user.block) {
       res.status(201).json({message:'User Account Blocked',Blocke:true})
      } else {
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({
          message: "Login Successfull",
          success: true,
          id: user._id,
          user_name:user.user_name,
          mobile:user.mobile,
          email:user.email,
          name: user.name,
          admin:user.admin,
          token: token,
          profile_pic: user.profile_pic,
          DOB:user.DOB,
          from:user.from,
          lives:user.lives,
          university:user.university,
          followers:user.followers,
          following:user.following,
          profileImage: user.profileImage,
        });
     }

    }
      
    } catch (error) {
      res.ststus(500).json({message:'login', error})
      
    }

   
    
  },
  userInfo: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      if (!user) {
        return res
          .status(200)
          .json({ message: "User does not exist", success: false });
      } else {
        res
          .status(200)
          .json({
            success: true,
            data: { name: user.name, email: user.email },
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error getting user info", success: false, error });
    }
  },
  newPost: async (req, res, next) => {
    try {
      const postData = req.body;

      const newPost = new UserPost(postData);
      await newPost.save();
    } catch (error) {
      res.status(500).json(error)

    }
  },
  getPosts: async (req, res, next) => {
    try {
       const userId = req.params.id;
       const user=await User.findOne({_id:userId})

       const friendsPost = await UserPost.find({userId:user.following,block:false}).populate('userId' ,'user_name profileImage')
       .sort({createdAt:-1});
       const currentUserPost = await UserPost.find({userId:userId,block:false}).populate('userId' ,'user_name profileImage')
       .sort({createdAt:-1});

       const timeLinePost = friendsPost.concat(currentUserPost)
     
       res.status(200).json({timeLinePost});
    
    } catch (error) {
      res.status(500).json(error)
    }
  },
  handleLike: async (req, res, next) => {
    try {
      const likedPost = await UserPost.findOne({ _id: req.body.postId });

      const userLiked = await likedPost.likes.includes(req.body.userId);

      if (userLiked) {
        await UserPost.updateOne(
          { _id: req.body.postId },
          {
            $pull: {
              likes: req.body.userId,
            },
          }
        );

        res
          .status(200)
          .json({
            mesage: "disliked successfully",
            liked: false
          });
      } else {
        await UserPost.updateOne(
          { _id: req.body.postId },
          {
            $push: {
              likes: req.body.userId,
            },
          }
        );
        res.status(200).json({ mesage: "liked successfully", liked: true });
      }
    } catch (error) {}
  },
  addComment: async (req, res, next) => {
    try {
      const commentData = {
        userId: req.body.userId,
        desc: req.body.comment,
      };

      const user = await User.findOne({ _id: req.body.userId });

      commentData.userName = user.user_name;

      await UserPost.updateOne(
        { _id: req.body.postId },
        {
          $push: {
            comments: commentData,
          },
        }
      );

      res
        .status(200)
        .json({ mesage: "commented successfully", commented: true });
    } catch (error) {}
  },
  getUsers: async (req, res, next) => {
    try {
     
      let userId=req.body.userId
      const allUsers = await User.find({followers:{$nin:userId}});
   
      res.status(200).json({ success: true, users: allUsers });
    } catch (error) {}
  },
  getFriends:async (req,res,next)=>{
    try {
      let userId=req.body.userId
      const friends = await User.find({followers:userId})
   
      res.status(200).json({ success: true, friends: friends });
  
    } catch (error) {
      res.status(500).json(error)
    }
  },
  follow: async (req, res, next) => {
    try {
      const userfollowing = await User.findOne({ _id: req.body.userId });
      const following = userfollowing.following.includes(req.body.followId);

      if (following) {
        await User.updateOne(
          { _id: req.body.userId },
          {
            $pull: {
              following: req.body.followId,
            },
          }
        );
        await User.updateOne(
          { _id: req.body.followId },
          {
            $pull: {
              followers: req.body.userId,
            },
          }
        );
        res
          .status(200)
          .json({ message: "unfollowing success", success: false });
      } else {
        await User.updateOne(
          { _id: req.body.userId },
          {
            $push: {
              following: req.body.followId,
            },
          }
        );
        await User.updateOne(
          { _id: req.body.followId },
          {
            $push: {
              followers: req.body.userId,
            },
          }
        );
        res.status(200).json({ message: "following success", success: true });
      }

    } catch (error) {}
  },
  editAbout:async(req,res,next)=>{
    try {
    
     
      const response=await User.updateOne({_id:req.body.userId},
        {
          $set:{
            user_name:req.body.data.user_name,
            email:req.body.data.email,
            mobile:req.body.data.mobile
          }
        })
        res.status(200).json({message:'edit success',success:true})
      
    } catch (error) {
      res.status(500).json(error)
    }

  },
  getUserDetails:async(req,res,next)=>{
    try {
      const user=await User.findOne({_id:req.params.id})
      res.status(200).json(user)
   
    } catch (error) {
      
    }
  },
  editMoreData:async (req,res,next)=>{
    try {
      
   

      const response= await User.updateOne({_id:req.body.userId},
        {
          $set:{
            university:req.body.data.university,
            lives:req.body.data.lives,
            from:req.body.data.from,
            DOB:req.body.data.DOB
            
          }
        })
        res.status(200).json({message:'edit success',success:true})
    } catch (error) {
      
    }
  },
  profileImage:async(req,res,next)=>{
    try {
   const updated= await User.findOneAndUpdate({_id:req.body.userId},
        {
          $set:{
            profileImage:req.body.profileImage
        }
        },{new:true})
     
       res.status(200).json({success:true,updated})
    } catch (error) {
      
    }
  },
  getProfilePic:async(req,res,next)=>{
    try {
 
      const editProfileImage =await User.findOne({_id:req.body.userId})
 
      res.status(200).json({message:'profile Photo updated successfully',success:true,editProfileImage})
    } catch (error) {
      res.status(500).json(error)
      
    }
  },
  savePost: async (req, res, next) => {
    try {
      let postId = req.params.id
      let userId = req.body.currentUserId

      const user = await User.findById(userId)
      const userSave = user.savedPosts.includes(postId)
     
      if (userSave) {
       await User.findByIdAndUpdate(userId, {
       
          $pull: {
            savedPosts:postId
          }
        
        })
        res.status(200).json({message:"Post Unsaved"})
        
      } else {
        
       await User.findByIdAndUpdate(userId, {
          
          $push: {
            savedPosts:postId
          }
          
        })
        res.status(200).json({message:"Post saved"})
      }
    } catch (error) {
      res.status(500).json(error)
      
    }
  },
  getSavedPosts: async (req, res, next) => {
    try {
      const userId=req.params.id
      const user=await User.findOne({_id:userId})
      const savedPosts = await UserPost.find({_id:user.savedPosts}).populate('userId' ,'user_name profileImage')
      .sort({createdAt:-1});
      
      
    
      res.status(200).json(savedPosts)
    } catch (error) {
      
      res.status(500).json(error)
    }
  },
  reportPost: async (req, res, next) => {
    try {
      const postId = req.params.id
      const userId = req.body.currentUserId
      const reportPost = await UserPost.findByIdAndUpdate(postId, {
        $push: {
          reports:userId
        }
      })
    } catch (error) {
      res.status(500).json(error)
      
    }
  }
};

const Conversation = require("../models/Conversation");

//new conv
module.exports={
    newChat:async(req,res,next)=>{
        console.log(req.body,'helo');
    
        const conversationUsers=await Conversation.find({members:{$all:[req.body.data.senderId,req.body.data.receiverId]}})
        console.log(conversationUsers,'conversationUsers');
        
        const {senderId,receiverId}=req.body.data
        const newConversation= new Conversation({
            members:[senderId,receiverId]
                     })
        try {
            if(conversationUsers.length===0){
                const savedConversation = await newConversation.save()
                res.status(200).json(savedConversation)
            }else{
                res.status(500).json({message:'user alredy exists',success:false})

            }
        } catch (error) {
            res.status(500).json(error)
        }
        
    },
    getChat:async(req,res,next)=>{
        try {
            console.log(req.params.userId,'userIIIddd');
            const conversation=await Conversation.find({
                members:{$in:[req.params.userId]}
            })
            console.log(conversation);
            res.status(200).json(conversation)
        } catch (error) {
            res.status(500).json(error)
        }
    }


}


//get conv of a user
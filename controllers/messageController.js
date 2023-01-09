const Message = require("../models/Message");

module.exports={
    newMessage:async(req,res,next)=>{
        const newMessage=new Message(req.body)
        try {
            const savedMessage = await newMessage.save()
            res.status(200).json(savedMessage)
        } catch (error) {
            req.status(500).json(error)
        }
    },
    getMessage:async(req,res,next)=>{
        console.log('conve');
        try {
            const messages=await Message.find(({
                conversationId:req.params.conversationId
            }))
            res.status(200).json(messages)
        } catch (error) {
            req.status(500).json(error)
            
        }
    }
}
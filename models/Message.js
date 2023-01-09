const mongoos = require("mongoose");


const MessageSchema = new mongoos.Schema(
    {
       conversationId:{
        type:String
       },
       sender:{
        type:String
       },
       text:{
        type:String
       }
        
    },
   
  {
    timestamps: true,
  }
);

const Message = mongoos.model("messages", MessageSchema);
// =========================================================

module.exports = Message;

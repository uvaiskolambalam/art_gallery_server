const mongoos = require("mongoose");


const ConversationSchema = new mongoos.Schema(
    {
        members:{
            type:Array
        }
        
    },
   
  {
    timestamps: true,
  }
);

const Conversation = mongoos.model("conversations", ConversationSchema);
// =========================================================

module.exports = Conversation;

const mongoos = require("mongoose");
const {ObjectId} =mongoos.Schema

const postSchema = new mongoos.Schema(
  {
    userId: {
      type:ObjectId,
      ref:"users",
      required: true,
    },
    imageUrl: {
        type: String,
        required: true,
      },
    desc: {
      type: String,
      
    },
    block: {
      type: Boolean,
      default:false
    },
    likes: {
        type: Array,
        
    },
    reports: {
      type: Array,
      ref:'users'
    },
    comments: [
        {
            userId:String,
            desc:String,
            userName:String
        },
    ],
  },
  {
    timestamps: true,
  }
);

const postModel = mongoos.model("posts", postSchema);
// =========================================================

module.exports = postModel;

const mongoos = require("mongoose");

const userSchema = new mongoos.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_name: {
        type: String,
        required: true,
      },
    email: {
      type: String,
      required: true,
    },
    mobile: {
        type: Number,
        required: true,
      },
    password: {
      type: String,
      required: true,
    },
    followers:{
      type:Array,

    },
    following:{
      type:Array
    },
    university:{
      type:String
    },
    lives:{
      type:String
    },
    from:{
      type:String
    },
    DOB:{
      type:String
    },
    profileImage:{
      type:String
    },
    admin: {
      type:Boolean
    },
    block: {
      type: Boolean,
      default:false
    },
    savedPosts:{
      type:Array
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoos.model("users", userSchema);
// =========================================================

module.exports = userModel;

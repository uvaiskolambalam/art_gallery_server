const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://uvaiskolambalam:643882478@cluster0.li7aq88.mongodb.net/art_gallery')

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("mongo db cnnected ");
});
connection.on("error", (error) => {
  console.log("error in mongoDB connection", error);
});
module.exports - mongoose;
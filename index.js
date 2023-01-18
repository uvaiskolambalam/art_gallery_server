const express =require('express')
const app = express()
const {createServer} =require('http')
const httpServer = createServer(app);
const cors=require('cors')
const bodyParser =require('body-parser')
app.use(cors())

// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions))

// require ('dotenv').config()
// dotenv.config()

const adminRoute=require('./routes/adminRoute')
const userRoute=require('./routes/userRoute')
const messageRoute=require('./routes/messages')
const consversationRoute=require('./routes/conversation')
require('dotenv').config()
app.use(express.json())
const dbConfig=require('./config/dbConfig')

app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/conversations',consversationRoute)
app.use('/messages',messageRoute)
app.use(bodyParser.json())


const port =process.env.PORT || 5000
app.listen(port, () => console.log(`node server started @ ${port}`))



// SOCKET ==============================================================================

// const io=require('socket.io')(8900,{
//     cors:{
//         origin:'http://localhost:3000'
//     }
// })
// const { createServer } from "http"


const  {Server} =require("socket.io");
const io = new Server(httpServer,{
    cors: {
        origin: ["https://live.artgallery.buzz:3000", "http://localhost:3000","https://live.artgallery.buzz"],
    },
  })
let users=[]

const addUser=(userId,socketId)=>{
    !users.some((user)=>user.userId === userId) &&
        users.push({userId,socketId})
}
const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId !== socketId)
}
const getUser=(userId)=>{
    return users.find(user=>user.userId === userId)
}
io.on("connection", (socket)=>{
    //when connect
    console.log("a user connected");
    
    //take userId and socketId from user
    socket.on('addUser',(userId)=>{
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    })

    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user=getUser(receiverId)
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            text
        })
    })


    //when dis connect
    socket.on("disconnected",()=>{
        console.log("a user disconnected");
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
    
})




// SOCKET
 


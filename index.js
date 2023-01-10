const express =require('express')
const app = express()
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
app.listen(port,() => console.log(`node server started @ ${port}`))
 


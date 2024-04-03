
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const PORT =  process.env.PORT ||5454
const cookieparser = require("cookie-parser")
const bodyparser =require("body-parser")
const morgan = require("morgan")

const userRoutes = require("./routes/userRoute")
const connectDB = require("./config/Database")
connectDB();
app.use(morgan("dev"))
app.use(express.json())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use (cookieparser())
app.use("/api/user",userRoutes)

app.listen(PORT,()=>{
    console.log(`app is running on port no. ${PORT}`)
})


const mongoose = require("mongoose" )

const database = async(req,res)=>{
    try {
        const connect = mongoose.connect(process.env.MONGODB_URL)
        console.log("connected database ")
    } catch (error) {
        console.log(error)
    }
}
module.exports =database
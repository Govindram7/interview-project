const jwt = require("jsonwebtoken")
const User = require("../models/userModels");

const authMiddelware = async (req, res, next) => {
    let token
    token = req.headers.authorization
    try {
        const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY)
        const user = await User.findById(decode.id);
        req.user = user
        next()
        
    } catch (error) {
        res.send("These Token are expired plz login again ..")
    }

};

module.exports = {authMiddelware}

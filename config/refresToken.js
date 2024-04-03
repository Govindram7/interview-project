const jwt = require("jsonwebtoken")
const generaterefresToken = (id) =>{ 
   return jwt.sign({id},process.env.JWT_SECREAT_KEY,{expiresIn:"1d"})
}

module.exports = generaterefresToken;

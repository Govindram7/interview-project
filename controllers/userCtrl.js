
const User = require("../models/userModels")
const generateToken = require("../config/generateToken")
const generaterefresToken = require("../config/refresToken")
const sendEmail = require("../controllers/mailerCtrl")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { error } = require("console")

// register a user
const createUser = async (req, res) => {
    try {
        const email = req.body.email
        const findUser = await User.findOne({ email })
        if (!findUser) {
            const newUser = await User.create(req.body)
            res.send(newUser)
        } else {
            throw new error("User already register plz check it...")
        }
    } catch (error) {
        res.send("user already register..")
    }

}

// login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body
    const findUser = await User.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refressToken = await generaterefresToken(findUser._id)
        const updateUser = await User.findByIdAndUpdate(findUser._id,
            {
                "refressToken": refressToken
            },
            {
                new: true
            }
        )
        res.cookie("refresToken", refressToken, {
            httponly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            contact: findUser?.contact,
            token: generateToken(findUser?._id),
        })
    } else {
        throw new error("data not matched..")
    }
}

// Get all users

const getallUser = async (req, res) => {
    try {
      const getUsers = await User.find();
      res.json(getUsers);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  // Get a single user
  const getaUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const getaUser = await User.findById(id);
      res.json({
        getaUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  


// handel refressToken 
const handelrefressToken = async (req, res) => {
    const cookie = req.cookies
    if (!cookie) throw  error("there is not refresh token in cookies ")
    const refressToken = cookie.refresToken
    const user = await User.findOne({ refressToken })
    if (!user) throw  error("there is not refresh token in database ")
    jwt.verify(refressToken, process.env.JWT_SECREAT_KEY, (err, decode) => {
        if (err || decode.id !== user.id) {
            console.log("user are not matched")
        }
        const accessToken = generateToken(user._id)
        res.send({ accessToken })
    })

}

// update password
const updatePassword = async(req,res)=>{
    try {
        const {id} = req.user
        console.log(id)
        const {password} = req.body
        const user = await User.findById(id)
        if(password){
            user.password = password
            const updatePassword = await user.save()
            res.json(updatePassword)
        }else{
            res.json(user)
        }
    } catch (error) {
        res.send("we cant change the password ")
    }
}

// forgotpassword token 
const forgotPasswordToken = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw  error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid til 5 minutes from now. <a href='http://localhost:5050/api/user/reset-password/${token}'>Click Here</> to reset password`;
      const data = {
        To: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        html: resetURL
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw  error(error);
    }
  };

  const resetPassword = async (req, res,next) => {
    const { password } = req.body;
    const {confirmpassword}= req.body
    const { token } = req.params;
    if (password == confirmpassword){next()}
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  };
  
module.exports = {
    createUser,
    loginUser,
    getaUser,
    getallUser,
    handelrefressToken,
    updatePassword,
    forgotPasswordToken,
    resetPassword
}

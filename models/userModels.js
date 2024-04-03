const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        // unique:true
    },
    password: {
        type: String,
        require: true,
    },

    refressToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = resetToken;
    this.passwordResetExpire = Date.now() + 5 * 60 * 1000; // Token expires in 5 minutes
    return resetToken;
};

module.exports = mongoose.model("registerUser", userSchema)




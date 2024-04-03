const express = require("express")
const router = express.Router()
const {
    createUser,
    loginUser,
    getallUser,
    getaUser,
    handelrefressToken,
    updatePassword,
    forgotPasswordToken,
} = require("../controllers/userCtrl")

const {authMiddelware} = require("../middelwares/authMiddelware")

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/all-users",authMiddelware, getallUser);
router.get("/:id",authMiddelware,getaUser);
router.post("/forgot-password-token",forgotPasswordToken)
router.put("/password",updatePassword)
router.get("/refresh", handelrefressToken)

module.exports = router



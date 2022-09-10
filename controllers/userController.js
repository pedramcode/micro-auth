const express = require("express")
const userRouter = express.Router()
const { response } = require("../utils")
const User = require("../models/userModel")
const OTP = require("../models/otpModel")

userRouter.post("/register", async (req, res)=>{
    if(!req.body || !("username" in req.body || "password" in req.body || "email" in req.body)){
        return response({res, data: "Pass all required parameters", status: 400})
    }
    
    const data = req.body
    const same_username_count = await User.find({username: data.username}).count()
    if(same_username_count > 0){
        return response({res, data: "Username already exists", status: 400})
    }

    const same_email_count = await User.find({email: data.email}).count()
    if(same_email_count > 0){
        return response({res, data: "Email already exists", status: 400})
    }

    const user = new User({
        username: data.username,
        password: data.password,
        email: data.email,
    })
    await user.save()

    const otp = new OTP({user: user})
    await otp.save()

    user.send_email(`Your OTP: ${otp.code}`)

    return response({res, data: user})
})


userRouter.get("/verify/:code", async (req, res) => {
    if(!req.params.code){
        return response({res, data: "Send all parameters", status: 400})
    }
    res.send("okay")
})


module.exports = userRouter
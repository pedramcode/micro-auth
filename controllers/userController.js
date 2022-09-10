const express = require("express")
const userRouter = express.Router()
const { response, fetch_setting } = require("../utils")
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
    console.log(otp.code)

    return response({res, data: user})
})


userRouter.get("/verify/:code", async (req, res) => {
    if(!req.params.code){
        return response({res, data: "Send all parameters", status: 400})
    }

    const code = req.params.code
    const otp = await OTP.findOne({code: code}).populate('user')
    if(!otp || otp.used){
        return response({res, data: "Invalid code", status: 400})
    }

    let trig = new Date()
    trig.setSeconds(trig.getSeconds() - fetch_setting("otp_lifespan"))
    if(trig>otp.created_at){
        return response({res, data: "Invalid code", status: 400})
    }

    otp.used = true
    otp.user.verified = true
    await otp.user.save()
    await otp.save()

    return response({res, data: "okay!"})
})


module.exports = userRouter
const express = require("express")
const userRouter = express.Router()
const userLogic = require("../logics/userLogic")
const { exception } = require("../utils")

userRouter.post("/register", async (req, res)=>{
    if(!req.body || !("username" in req.body || "password" in req.body || "email" in req.body)){
        return exception({res, data: "Pass all required parameters", status: 400})
    }
    try{
        let user = userLogic.UserRegister(req.body)
    }catch(err){
        return err
    }
    res.send(user)
})

module.exports = userRouter
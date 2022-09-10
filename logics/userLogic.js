const User = require("../models/userModel")
const { exception } = require("../utils")


async function UserRegister({username, password, email}){
    const same_username_count = User.find({username: username}).count()
    if(same_username_count > 0){
        return exception({res, data: "Username already exists", status: 400})
    }
    const same_email_count = User.find({email: email}).count()
    if(same_email_count > 0){
        return exception({res, data: "Email already exists", status: 400})
    }
    const user = new User({username, password, email})
    await user.save()
    return user
}

module.exports = {
    UserRegister,
}
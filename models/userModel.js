const { Schema, model } = require("mongoose")
const { hash_string } = require("../utils")


const userSchema = new Schema({
    username: { type: String, maxLength: 64, required: true, unique: true},
    password: { type: String, maxLength: 64, required: true, set: val=>hash_string(val)},
    email: { type: String, maxLength: 128, required: true, unique: true},
    blocked: { type: Boolean, default: false, required: true },
    is_admin: { type: Boolean, default: false, required: true},
}, { timestamps: true })

userSchema.methods.send_email = function send_email(content){
    // Email codes here
}

const User = model("User", userSchema)

module.exports = User
const { Schema, model } = require("mongoose")
const { generate_otp } = require("../utils")


const otpSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    code: { type: String, maxLength: 16 },
    used: { type: Boolean, default: false },
}, { timestamps: true })

otpSchema.pre("save", function $(next){
    this.code = generate_otp()
    next()
})

const OTP = model("OTP", otpSchema)

module.exports = OTP
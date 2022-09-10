const fs = require("fs")
const crypto = require("crypto")
const otpGenerator = require('otp-generator')

function fetch_setting({key, _default=""}){
    try{
        data = fs.readFileSync("./settings.json")
        data = JSON.parse(data)
        if(key in data){
            return data[key]
        }else{
            return _default
        }
    } catch {
        return _default
    }
}


function hash_string(value){
    let hash = crypto.createHash('sha256').update(value).digest('hex');
    return hash
}

function generate_otp(){
    return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
}

function response({res, data, status=200}){
    res.status(status)
    return res.send({data})
}


module.exports = {
    fetch_setting,
    hash_string,
    generate_otp,
    response,
}
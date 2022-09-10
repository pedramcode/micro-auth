const fs = require("fs")
const crypto = require("crypto")

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

function exception({res, data, status}){
    res.status(status || 500)
    return res.send({
        error: data
    })
}


module.exports = {
    fetch_setting,
    hash_string,
    exception,
}
const jwt = require('jsonwebtoken');
var userSchema = require('../../models/user.js');
require('dotenv').config();

exports.generate = (id) => {
    return token= jwt.sign({signiature: id}, process.env.secretkey, {
        expiresIn : +process.env.tokenExpireTime
      });
}

exports.authentification =async (req,res,next)  => {
    var authHeader = req.headers['authorization']
    
    var token = authHeader && authHeader.split(' ')[1]

    token == undefined ? token = authHeader  : token = authHeader && authHeader.split(' ')[1]

    var value = 0;
    try {
        const decoded = jwt.verify(token, process.env.secretkey);
        value= await userSchema.find({_id:decoded['signiature']}).countDocuments();
       }
       catch (ex) { console.log(ex.message); }
      
       if (value) {
        next()
       }else{
        return res.status(401).json({
            status:"TOKEN UNVALID"
        })
       }
}
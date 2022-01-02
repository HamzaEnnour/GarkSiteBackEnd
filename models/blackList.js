const mongoose =require('mongoose')
const Schema = mongoose.Schema

var blackList = Schema({
    suspect: {
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }, 
    illegalTransaction: {
        type:Object,
        required:true
    }, 
    team: {
        type:Schema.Types.ObjectId,
        ref: "team"
    },
    description:{
        type:String,
        required:true
    },
    ip_adress:{
        type:String,
        required:true
    },
    date_blackListed: {
        "type": Date,
        "default": Date.now
    },
})

module.exports = mongoose.model('blackList',blackList ,'blackList')
const mongoose =require('mongoose')
const Schema = mongoose.Schema
var story = Schema({
    title: {
        type:String,

    },
    description: {
        type:String,  
    },
    expired: {
        type:Boolean,  
        "default": false
    },
    duration: {
        type: Number,
        "default": 0
    },
    content: {
        type:String,
   
    },
    contentType: {
        type:String,
        required:true
    },
    creator: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"user",
        "default": []
    }],
    views:[{
        type:Schema.Types.ObjectId,
        ref:"user",
        "default": []
    }],
    date_created:{ "type": Date, "default": Date.now }
})

module.exports = mongoose.model('story',story ,'story')
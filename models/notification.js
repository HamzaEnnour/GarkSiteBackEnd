const mongoose =require('mongoose')
const Schema = mongoose.Schema

var notification = Schema({
    notificationType: {
        type:String,
        required: true
    },
    content: {
        type:String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    seen: {
        type:Boolean,  
        "default": false
    },
    confirmed: {
        type:Boolean,  
    },
    created_at:{
        "type": Date,
        "default": Date.now
    }
})

module.exports = mongoose.model('notification',notification ,'notification')
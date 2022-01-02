const mongoose =require('mongoose')
const Schema = mongoose.Schema

var matchAction = Schema({
    player: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"skills"
    },
    challenge: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"challenge"
    },
    match: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"match"
    },
    team: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"team"
    },
    minutes: {
        type:Number,
        required:true
    },
    type: {
        type:String,
        required:true
    },
})

module.exports = mongoose.model('matchAction',matchAction ,'matchAction')
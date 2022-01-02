const mongoose =require('mongoose')
const Schema = mongoose.Schema

var matchVote = Schema({
    voter: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    voteType:{
        type:String,
        required:true,
    },
    votedOnPlayer: {
        type:Schema.Types.ObjectId,
        ref:"skills"
    },
    votedOnTeam: {
        type:Schema.Types.ObjectId,
        ref:"team"
    },
    pace: {
        type:Number,
 
    },
    rating: {
        type:Number,
   
    },
    shooting: {
        type:Number,

    },
    passing: {
        type:Number,
     
    },
    dribbling: {
        type:Number,

    },
    defending: {
        type:Number,

    },
    physical: {
        type:Number,
   
    },
    vote_date:{ 
        "type": Date, "default": Date.now 
    },


})

module.exports = mongoose.model('matchVote',matchVote ,'matchVote')
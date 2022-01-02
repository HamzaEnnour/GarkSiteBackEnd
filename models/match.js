const mongoose =require('mongoose')
const Schema = mongoose.Schema

var match = Schema({
    start_date: {
        type:Date,
        required:true
    },
    end_date: {
        type:Date,
    },
    team1: {
        type:Schema.Types.ObjectId,
        ref:"team"
    },
    team2: {
        type:Schema.Types.ObjectId,
        ref:"team"
    },
    goals: [{
        type:Schema.Types.ObjectId,
        ref:"matchAction"
        ,
        "default": []
    }],
    yellowCards: [{
        type:Schema.Types.ObjectId,
        ref:"matchAction",
        "default": []
    }],
    redCards: [{
        type:Schema.Types.ObjectId,
        ref:"matchAction"
        ,
        "default": []
    }],
    winner:{
        type:Schema.Types.ObjectId,
        ref:"team"  
    },

    //round, semi final, phase de poule ...
    type: {
        type:String,
        required:true
    },
    //on going, pending, finished
    state: {
        type:String,
        required:true
    },
    penalty:{
        type:Boolean,
        'default':false
    },
    prolongation:{
        type:Boolean,
        'default':false
    },
    manOfTheMatch: {
        type:Schema.Types.ObjectId,
 
        ref:"user"
    }, 
    terrain: {
        type:Schema.Types.ObjectId,
 
        ref:"terrain"
    }, 
})

module.exports = mongoose.model('match',match ,'match')
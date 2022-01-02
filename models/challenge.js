const mongoose =require('mongoose')
const Schema = mongoose.Schema
var challenge = Schema({
    name: {
        type:String,
        required:true,
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    date_created:{
        "type": Date, "default": Date.now 
    },
    maxNumberOfTeams:{
        type:Number,
        required:true 
    },
    matchDuration:{
        type:Number,
        'default':90
    },
    location:{
        type:String,
        required:true 
    },
    description:{
        type:String,
    },
    prize1:{
        type:Number,
        required:true 
    },
    prize2:{
        type:Number,
        required:true 
    },
    gain:{
        type:Number,
        required:true 
    },
    fees:{
        type:Number,
        required:true 
    },
    winner:{
        type:Schema.Types.ObjectId,
        ref:"team"  
    },
    teams:[{
        type:Schema.Types.ObjectId,
        ref:"team"  ,
        "default": []
    }],
    matches:[{
        type:Schema.Types.ObjectId,
        ref:"match" ,
        "default": [] 
    }],
    //Univiestié, clubs(academy), sport travail, amateur...
    categorie: {
        type:String,
        required:true
    }, 
    //Championat, phase de poule, coupe 
    type:{
        type:String,
    },
    playerPerTeam:{
        type:Number,
        required:true 
    },
    //optionnel 
    terrain:{
        type:Schema.Types.ObjectId,
        ref:"terrain"  
    },
    //on going, pending, finished
    state:{
        type:String,
        required:true 
    },
    GCdistributed:{
        type:Boolean,
        "default": false
    },
    image:{
        type:String,
        required:true 
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:"user"  
    },
    ///akther wa7ed ja man of the match
    manOfTheTournement:{
        type:Schema.Types.ObjectId,
        ref:"user"  
    },
})

module.exports = mongoose.model('challenge',challenge ,'challenge')
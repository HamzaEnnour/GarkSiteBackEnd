const mongoose = require('mongoose')
const Schema = mongoose.Schema
var team = Schema({
    name: {
        type: String,
        required: true
    },
    blackListed : { "type": Boolean, "default": false },
    //Y7eb 3bad teb3athlou request bech tod5el ou non
    private: {
        type: Boolean,
        "default": false,
        //required:true
    },
    image: {
        type: String,
        //required:true
    },
    //Univiestié, clubs(academy), sport travail, amateur...
    categorie: {
        type: String,
        required: true
    },
    capitaine: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "skills"
    },
    titulares: [{
        type: Schema.Types.ObjectId,
        //required:true,
        ref: "skills",
        "default": [],
    }],
    substitutes: [{
        type: Schema.Types.ObjectId,
        //required:true,
        ref: "skills",
        "default": []
    }],
    points: {
        type: Number,
        required: true
    },
    nationality: {
        type: Schema.Types.ObjectId,
        ref: "nationality",
        required: true
    },
    date_created: {
        "type": Date,
        "default": Date.now
    },
    description: {
        type: String,
        required: true
    },

    moneybox: {
        type: Number,
        "default": 0 
    },
    ///////////////////////////////addition
    draws: [{
        type: Schema.Types.ObjectId,
        ref: "match",
        "default": []
    }],
    victories: [{
        type: Schema.Types.ObjectId,
        ref: "match",
        "default": []
    }],
    defeats: [{
        type: Schema.Types.ObjectId,
        ref: "match",
        "default": []
    }],
    rating: {
        type: Number,
        "default": 0
    },
    votes: [{
        type: Schema.Types.ObjectId,
        ref: "matchVote",
        "default": []
    }],
    participations: [{
        type: Schema.Types.ObjectId,
        ref: "challenge",
        "default": []
    }],
    champions: [{
        type: Schema.Types.ObjectId,
        ref: "challenge",
        "default": []
    }],
    secondPrizes: [{
        type: Schema.Types.ObjectId,
        ref: "challenge",
        "default": []
    }],
    prizeCollected:{
        type:Number,
        "default":0
    }
})

module.exports = mongoose.model('team', team, 'team')
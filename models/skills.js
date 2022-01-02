const mongoose = require('mongoose')
const Schema = mongoose.Schema
var skills = Schema({
    pace: {
        type: Number,
        required: true
    },
    shooting: {
        type: Number,
        required: true
    },
    passing: {
        type: Number,
        required: true
    },
    dribbling: {
        type: Number,
        required: true
    },
    defending: {
        type: Number,
        required: true
    },
    physical: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },

    role: {
        type: String,
        required: true
    },
    player: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    nationality: {
        type: Schema.Types.ObjectId,
        ref: "nationality",
        required: true
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: "team",
        "default": []
    }],
    favoriteteams: [{
        type: Schema.Types.ObjectId,
        ref: "team",
        "default": []
    }],
    favoriteplayers: [{
        type: Schema.Types.ObjectId,
        ref: "skills",
        "default": []
    }],
    age: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    xp: {
        type: Number,
        "default": 0
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    bestTeamWorld: {
        type: Schema.Types.ObjectId,
        ref: "club",
    },
    bestTeamLocal: {
        type: Schema.Types.ObjectId,
        ref: "club",
    },
    bestPlayerWorld: {
        type: Schema.Types.ObjectId,
        ref: "player",
    },
    bestPlayerLocal: {
        type: Schema.Types.ObjectId,
        ref: "player",
    },
    ///////////////////////////////addition
    dossart: {
        type: Number,
        "default": 0
    },
    rating: {
        type: Number,
        "default": 0
    },
    goals: [{
        type: Schema.Types.ObjectId,
        ref: "matchAction",
        "default": []
    }],
    yellowCards: [{
        type: Schema.Types.ObjectId,
        ref: "matchAction",
        "default": []
    }],
    redCards: [{
        type: Schema.Types.ObjectId,
        ref: "matchAction",
        "default": []
    }],
    votes: [{
        type: Schema.Types.ObjectId,
        ref: "matchVote",
        "default": []
    }],
    manOfTheMatch: [{
        type: Schema.Types.ObjectId,
        ref: "match",
        "default": []
    }],
    manOfTheTournement: [{
        type: Schema.Types.ObjectId,
        ref: "challenge",
        "default": []
    }],
    matches: [{
        type: Schema.Types.ObjectId,
        ref: "match",
        "default": []
    }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "story",
        "default": []
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: "notification",
        "default": []
    }],
    favoritechallenges: [{
        type: Schema.Types.ObjectId,
        ref: "challenge",
        "default": []
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "skills",
        "default": []
    }],
})

module.exports = mongoose.model('skills', skills, 'skills')
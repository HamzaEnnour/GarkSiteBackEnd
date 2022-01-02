const mongoose =require('mongoose')
const Schema = mongoose.Schema

var player = Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    image: {
        type:String,
        "default": "Not mentioned"
    },
})

module.exports = mongoose.model('player',player ,'player')
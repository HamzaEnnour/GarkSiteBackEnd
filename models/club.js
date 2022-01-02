const mongoose =require('mongoose')
const Schema = mongoose.Schema

var club = Schema({
    name: {
        type:String,
        required:true
    },
    image: {
        type:String,
        "default": "Not mentioned"
    },
})

module.exports = mongoose.model('club',club ,'club')
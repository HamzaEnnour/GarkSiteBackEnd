const mongoose =require('mongoose')
const Schema = mongoose.Schema

var terrain = Schema({
    name: {
        type:String,
        required:true
    },
    localisation: {
        type:String,
        required:true
    }, 
    image: {
        type:String,
        required:true
    },
    availabilities:[{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"availability"  
    }]
})

module.exports = mongoose.model('terrain',terrain ,'terrain')
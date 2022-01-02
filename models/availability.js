const mongoose =require('mongoose')
const Schema = mongoose.Schema

var availability = Schema({
    start_date: {
        type:Date,
        required:true
    },
    end_date: {
        type:Date,
        required:true
    },
    terrain: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"terrain"
    }
})

module.exports = mongoose.model('availability',availability ,'availability')
const mongoose =require('mongoose')
const Schema = mongoose.Schema

var transaction = Schema({
    transactionType: {
        type:String,
        required:true
    },
    from: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }, 
    to: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    teamTarget:{
        type:Schema.Types.ObjectId,
        ref:'team'
    },
    amount:{
        type:Number,
        required:true
    },
    substraction:{
        type:Boolean,
        "default":true
    },
    senderWallet:{
        type:Number,
        required:true
    },
    date_transaction: {
        "type": Date,
        "default": Date.now
    },
})

module.exports = mongoose.model('transaction',transaction ,'transaction')
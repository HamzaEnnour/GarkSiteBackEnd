const transactionServie = require('../services/transaction_module')
module.exports = {
    //find by id 
    findByIdTransactionRoute: (res, id) => {
        transactionServie.findById(res, id).then(function (result) {
            res.status(200).json(result)
        })
    },
    //get all transaction by user id 
    getAllTransactionsByUserRoute: (res, userId,page) => {
        transactionServie.getAllTransactionsByUser(res,userId,page).then(function (result) {
            res.status(200).json({
                message: "all transactions",
                transactions: result
            })
        })
    },
    //add transaction
    addTransactionRoute: (req, res) => {
        try {
            transactionServie.addTransaction(req, res).then(function (result) {
              
                if(result){
                    console.log("transaction sucessful")
                    res.status(201).json({
                        message: "transaction sucessful"
                    })
                }else{
                    console.log("You made an illeagal transaction, you are Blacklisted")
                    res.status(200).json({
                        message: "You made an illeagal transaction, you are Blacklisted"
                    })  
                }
            }
            )
        } catch (error) {
            console.log(error);
        }
    },
}


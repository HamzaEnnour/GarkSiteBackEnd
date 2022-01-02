var transaction = require('../api/transactionController')
const passport = require('../api/middleware/passport.js');

module.exports = (app) => {
    app.get('/all_transactions/:id/:page', passport.authentification, (req, res) => { var id = req.params.id;  var page = req.params.page;transaction.getAllTransactionsByUserRoute(res, id,page) })
    app.post('/add_transaction', passport.authentification, (req, res) => { transaction.addTransactionRoute(req, res) })
    app.get('/findByIdtransaction/:id', passport.authentification, (req, res) => { var id = req.params.id; transaction.findByIdTransactionRoute(res, id) })
}
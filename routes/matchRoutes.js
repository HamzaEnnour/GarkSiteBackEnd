var match = require('../api/matchController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    app.get('/all_matchs',passport.authentification,(req,res) =>{match.getAllmatchsRoute(res)})
    app.post('/add_match',passport.authentification,(req,res) =>{match.addmatchRoute(req,res)})
    app.delete('/delete_match/:id',passport.authentification,(req,res) =>{match.deletematchRoute(req.params.id,res)})
    app.put('/update_match/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;match.updatematchRoute(id,reqBody,res)})
    app.put('/update_matches',passport.authentification,(req,res) =>{var reqBody=req.body;match.updatematchesRoute(reqBody,res)})
    app.get('/findByIdmatch/:id',passport.authentification,(req,res) =>{var id =req.params.id;match.findByIdmatchsRoute(res,id)}) 
    /// addition
    app.get('/findByteammatch/:id',passport.authentification,(req,res) =>{var id =req.params.id;match.findByteammatchsRoute(res,id)}) 
}
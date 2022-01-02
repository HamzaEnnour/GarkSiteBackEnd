var history_team = require('../api/history_teamController')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    app.get('/all_history_team',passport.authentification,(req,res) =>{history_team.getAllHistorysRoute(res)})
    app.get('/findByIdHistory_team/:id',passport.authentification,(req,res) =>{var id =req.params.id;history_team.findByIdHistory_teamRoute(res,id)})
    app.get('/findHistoryByUserId/:id',passport.authentification,(req,res) =>{var id =req.params.id;history_team.findByUserHistory_teamRoute(res,id)})
    app.get('/findHistoryByTeamId/:id',passport.authentification,(req,res) =>{var id =req.params.id;history_team.findByTeamHistory_teamRoute(res,id)})
    app.post('/add_history_team',passport.authentification,(req,res) =>{history_team.addHistory_teamRoute(req,res)})
    app.delete('/delete_history_team/:id',passport.authentification,(req,res) =>{history_team.deleteHistory_teamRoute(req.params.id,res)})
    app.put('/update_history_team/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;history_team.updateHistory_teamRoute(id,reqBody,res)})    
}
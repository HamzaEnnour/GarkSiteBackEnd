var team = require('../api/teamController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    app.get('/all_teams/:page',passport.authentification,(req,res) =>{var page=req.params.page;team.getAllteamsRoute(res,page)})
    app.get('/findByIdTeam/:id',passport.authentification,(req,res) =>{var id =req.params.id;team.findByIdteamsRoute(res,id)})
    app.get('/getteams',passport.authentification,(req,res) =>{team.getTeams(res)})
    app.get('/findByCapitainId/:id',passport.authentification,(req,res) =>{var id =req.params.id;team.findByCapitainId(res,id)})
    app.post('/add_team',passport.authentification,(req,res) =>{team.addteamRoute(req,res)})
    app.delete('/delete_team/:id',passport.authentification,(req,res) =>{team.deleteteamRoute(req.params.id,res)})
    app.put('/update_team/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;team.updateteamRoute(id,reqBody,res)})    
}
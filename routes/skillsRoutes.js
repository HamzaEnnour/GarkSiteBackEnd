var skills = require('../api/skillsController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    app.get('/all_skills/:page',passport.authentification,(req,res) =>{var page=req.params.page;skills.getAllskillssRoute(res,page)})
    app.post('/add_skills',passport.authentification,(req,res) =>{skills.addskillsRoute(req,res)})
    app.delete('/delete_skills/:id',passport.authentification,(req,res) =>{skills.deleteskillsRoute(req.params.id,res)})
    app.put('/update_skills/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;skills.updateskillsRoute(id,reqBody,res)})
    app.get('/findByIdskills/:id',passport.authentification,(req,res) =>{var id =req.params.id;skills.findByIdskills(res,id)})
    app.get('/findPlayerByIdskills/:id',passport.authentification,(req,res) =>{var id =req.params.id;skills.findPlayerIdskills(res,id)})
    //Get top players
    app.get('/top_players/:page',passport.authentification,(req,res) =>{var page=req.params.page;skills.getTopPlayersRoute(res,page)})
    //Add team to player
    app.put('/add_team_player/:id/:teamId',passport.authentification,(req,res) =>{var id =req.params.id;var teamId =req.params.teamId;skills.addTeamToPlayer(id,teamId,res)})
    //
    app.put('/add_favorite_player',passport.authentification,(req,res) =>{skills.addToFavoritePlayers(req,res)})
    app.put('/add_favorite_team',passport.authentification,(req,res) =>{skills.addToFavoriteTeams(req,res)})
    app.put('/add_favorite_challenge',passport.authentification,(req,res) =>{skills.addToFavoriteChallenges(req,res)})

    app.put('/update_team_player_best',passport.authentification,(req,res) =>{skills.updateTeamPlayerBest(req,res)})
}
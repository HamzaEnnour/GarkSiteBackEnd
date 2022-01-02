var challenge = require('../api/challengeController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
//add Team
app.put('/add_team_challenge/:id/:teamId',passport.authentification,(req,res) =>{var id =req.params.id;var teamId =req.params.teamId;challenge.addTeamToChallenge(id,teamId,res)})
//remove Team from Challenge
app.put('/remove_team_challenge/:id/:teamId',passport.authentification,(req,res) =>{var id =req.params.id;var teamId =req.params.teamId;challenge.removeTeamFromChallenge(id,teamId,res)})
//find by name
app.get('/findByName/:name',passport.authentification,(req,res) =>{var name =req.params.name;challenge.findByName(res,name)});
app.get('/getChallenges',passport.authentification,(req,res) =>{var name =req.params.name;challenge.getChallenges(res,name)});
//add Match to challenge
app.put('/add_match_challenge/:id/:matchId',passport.authentification,(req,res) =>{var id =req.params.id;var matchId =req.params.matchId;challenge.addMatchToChallenge(id,matchId,res)})
//find challenges by team
app.get('/findChallengesByTeam/:id',passport.authentification,(req,res) =>{var id =req.params.id;challenge.getChallengeByTeamRoute(id,res)})
//find challenge by match
app.get('/findChallengesByMatch/:id',passport.authentification,(req,res) =>{var id =req.params.id;challenge.getChallengeByMatchRoute(id,res)})

app.get('/all_challenges/:page',passport.authentification,(req,res) =>{var page=req.params.page;challenge.getAllchallengesRoute(res,page)})
app.post('/add_challenge',passport.authentification,(req,res) =>{challenge.addchallengeRoute(req,res)})
app.delete('/delete_challenge/:id',passport.authentification,(req,res) =>{challenge.deletechallengeRoute(req.params.id,res)})
app.put('/update_challenge/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;challenge.updatechallengeRoute(id,reqBody,res)})
app.get('/findByIdchallenge/:id',passport.authentification,(req,res) =>{var id =req.params.id;challenge.findByIdchallengesRoute(res,id)})
}
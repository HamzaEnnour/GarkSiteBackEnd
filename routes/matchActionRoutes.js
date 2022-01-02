var matchAction = require('../api/matchActionController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
//group by team
app.get('/groupByTeam/:teamId',passport.authentification,(req,res) =>{var teamId =req.params.teamId;matchAction.findByRoutes(res,teamId,"team")})
//group by player
app.get('/groupByPlayer/:playerId',passport.authentification,(req,res) =>{var playerId =req.params.playerId;matchAction.findByRoutes(res,playerId,"player")})
//group by challenge
app.get('/groupByChallenge/:challengeId',passport.authentification,(req,res) =>{var challengeId =req.params.challengeId;matchAction.findByRoutes(res,challengeId,"challenge")})
//group by match
app.get('/groupByMatch/:matchid',passport.authentification,(req,res) =>{var matchid =req.params.matchid;matchAction.findByRoutes(res,matchid,"match")})

app.post('/add_matchAction',passport.authentification,(req,res) =>{matchAction.addmatchActionRoute(req,res)})
app.delete('/delete_matchAction/:id',passport.authentification,(req,res) =>{matchAction.deletematchActionRoute(req.params.id,res)})
app.put('/update_matchAction/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;matchAction.updatematchActionRoute(id,reqBody,res)})
app.get('/findByIdmatchAction/:id',passport.authentification,(req,res) =>{var id =req.params.id;matchAction.findByIdmatchActionsRoute(res,id)})
}
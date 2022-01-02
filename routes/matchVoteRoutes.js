var matchVote = require('../api/matchVoteController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    ///findVoteByVoter
app.get('/findVoteByVoter/:userid',passport.authentification,(req,res) =>{var userid =req.params.userid;matchVote.findVoteByVoter(res,userid)})

app.get('/all_matchVotes/:userid',passport.authentification,(req,res) =>{var userid =req.params.userid;matchVote.getAllmatchVotesRoute(res,userid)})
app.post('/add_matchVote',passport.authentification,(req,res) =>{matchVote.addmatchVoteRoute(req,res)})
app.delete('/delete_matchVote/:id',passport.authentification,(req,res) =>{matchVote.deletematchVoteRoute(req.params.id,res)})
app.put('/update_matchVote/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;matchVote.updatematchVoteRoute(id,reqBody,res)})
app.get('/findByIdmatchVote/:id',passport.authentification,(req,res) =>{var id =req.params.id;matchVote.findByIdmatchVotesRoute(res,id)})
 
}
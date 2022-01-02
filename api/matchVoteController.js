const matchVoteServie = require('../services/matchVote_module')

module.exports = {
    findVoteByVoter:(res,voterId) =>{
        matchVoteServie.VotesByVoter(res,voterId).then(function (result) {
            res.status(200).json({
                message:"all matchVotes",
                matchVotes:result})
            })    
    },
//get all matchVotes 
    getAllmatchVotesRoute:(res,userid) =>{
    matchVoteServie.getAllmatchVotes(res,userid).then(function (result) {
        res.status(200).json({
            message:"all matchVotes",
            matchVotes:result})
        })    
},
//add matchVote
    addmatchVoteRoute:(req,res)=>{
        try {
            matchVoteServie.addmatchVote(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete matchVote route
    deletematchVoteRoute: (id,res)=>{
        try {
            matchVoteServie.deletematchVoteById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update matchVote route
    updatematchVoteRoute:(id,reqBody,res)=>{
        try {
            var matchVote = {
                matchVoteName:reqBody.matchVoteName,
                matchVoteAmount:reqBody.matchVoteAmount,
                dateCreation:reqBody.dateCreation,
                type:reqBody.type
            }
            matchVoteServie.updatematchVote(matchVote,id,res)
        } catch (error) {
            console.log(error)
        }
    }
}


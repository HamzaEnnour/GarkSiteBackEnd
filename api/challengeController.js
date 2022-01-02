const challengeServie = require('../services/challenge_module')
const matchServie = require('../services/match_module')
module.exports = {

    //add team to challenge
    addTeamToChallenge:(id,teamId,res)=>{
        try {
            challengeServie.add(id,teamId,res)
        } catch (error) {
            console.log(error)
        }
    },
        //removeTeamFromChallenge
        removeTeamFromChallenge:(id,teamId,res)=>{
            try {
                challengeServie.remove(id,teamId,res)
            } catch (error) {
                console.log(error)
            }
        },
            //add team to challenge
    addMatchToChallenge:(id,matchId,res)=>{
        try {
            challengeServie.addMatch(id,matchId,res)
        } catch (error) {
            console.log(error)
        }
    },
        
    //find by name
    findByName:(res,name) =>{
        challengeServie.findByName(res,name).then(function (result) {
            res.status(200).json(result)
            })    
    },
    getChallenges:(res,name) =>{
        challengeServie.getChallenges(res,name).then(function (result) {
            res.status(200).json(result)
            })    
    },
//get all challenges 
    getAllchallengesRoute:(res,page) =>{
    challengeServie.getAllchallenges(res,page).then(function (result) {
        res.status(200).json({
            message:"all challanges",
            challenges:result})
        })    
},
//get all challenges by team
getChallengeByTeamRoute:(id,res) =>{
    challengeServie.getChallengeByTeam(id,res).then(function (result) {
        res.status(200).json({
            message:"all challanges",
            challenges:result})
        })    
},

//get  challenge by match
getChallengeByMatchRoute:(id,res) =>{
    challengeServie.getChallengeByMatch(id,res).then(function (result) {
        res.status(200).json(result)
        })    
},
//add challenge
    addchallengeRoute:async (req,res)=> {
        try {
     
            req.body.matches= await matchServie.generateMatches(req.body.matches);
            challengeServie.addchallenge(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete challenge route
    deletechallengeRoute: (id,res)=>{
        try {
            challengeServie.deletechallengeById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update challenge route
    updatechallengeRoute:(id,reqBody,res)=>{
        try {
            var challenge = {
                state:reqBody.state,
                winner:reqBody.winner,
                manOfTheTournement:reqBody.manOfTheTournement,
                end_date:reqBody.end_date
            }
            challengeServie.updatechallenge(challenge,id,res)
        } catch (error) {
            console.log(error)
        }
    },
    //update challenge route
    findByIdchallengesRoute:(res,id)=>{
            try {
       
                challengeServie.findById(res,id).then(function (result) {
                    res.status(200).json(result)
                    })    
            } catch (error) {
                console.log(error)
            }
        }
}


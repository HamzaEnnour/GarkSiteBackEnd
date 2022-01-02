const skillsServie = require('../services/skills_module')

module.exports = {
    //join team
    addTeamToPlayer:(id,teamId,res)=>{
        try {
            skillsServie.add(id,teamId,res)
        } catch (error) {
            console.log(error)
        }
    },
        //find by id 
        findByIdskills:(res,id) =>{
            skillsServie.findById(res,id).then(function (result) {
                res.status(200).json(result)    
        })
    },
    findPlayerIdskills:(res,id) =>{
        skillsServie.findByPlayerId(res,id).then(function (result) {
            res.status(200).json(result)    
    })
},
    
    //TOP players 
    getTopPlayersRoute:(res,page) =>{
        skillsServie.getTopPlayers(res,page).then(function (result) {
            res.status(200).json({
                message:"all best players",
                topPlayers:result})
            })    
    },
//get all skillss 
    getAllskillssRoute:(res,page) =>{
    skillsServie.getAllskillss(res,page).then(function (result) {
        res.status(200).json({
            message:"all skills",
            skills:result})
        })    
},
//add skills
    addskillsRoute:(req,res)=>{
        try {
            skillsServie.addskills(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete skills route
    deleteskillsRoute: (id,res)=>{
        try {
            skillsServie.deleteskillsById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update skills route
    updateskillsRoute:(id,reqBody,res)=>{
        try {
            skillsServie.updateskills(reqBody,id,res)
        } catch (error) {
            console.log(error)
        }
    },
    addToFavoritePlayers:(req,res)=>{
        try {
            skillsServie.addToFavoritePlayers(req,res);
        } catch (error) {
            console.log(error);
        }
    },
    addToFavoriteTeams:(req,res)=>{
        try {
            skillsServie.addToFavoriteTeams(req,res);
        } catch (error) {
            console.log(error);
        }
    },
    addToFavoriteChallenges:(req,res)=>{
        try {
            skillsServie.addToFavoriteChallenges(req,res);
        } catch (error) {
            console.log(error);
        }
    },
    updateTeamPlayerBest:(req,res)=>{
        try {
            skillsServie.updateTeamPlayerBest(req,res);
        } catch (error) {
            console.log(error);
        }
    },
}


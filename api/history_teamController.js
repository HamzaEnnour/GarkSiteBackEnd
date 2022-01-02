const history_teamServie = require('../services/history_team_module')

module.exports = {
    //find by id 
    findByIdHistory_teamRoute:(res,id) =>{
        history_teamServie.findById(res,id).then(function (result) {
            res.status(200).json(result)    
    })
},
    findByUserHistory_teamRoute:(res,id) =>{
        history_teamServie.findByUserInHistory(res,id).then(function (result) {
        res.status(200).json(result)    
})
},
    findByTeamHistory_teamRoute:(res,id) =>{
        history_teamServie.findByTeamInHistory(res,id).then(function (result) {
        res.status(200).json(result)    
})
},
//get all History_team 
getAllHistorysRoute:(res) =>{
        history_teamServie.getAllHistory(res).then(function (result) {
        res.status(200).json({
            message:"all History_team",
            teams:result})
        })    
},
//add History_team
    addHistory_teamRoute:(req,res)=>{
        try {
            history_teamServie.addhistory_team(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete History_team route
    deleteHistory_teamRoute: (id,res)=>{
        try {
            history_teamServie.deleteHistoryById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update History_team route
    updateHistory_teamRoute:(id,reqBody,res)=>{
        try {
            history_teamServie.updatehistory_team(reqBody,id,res)
        } catch (error) {
            console.log(error)
        }
    }
}


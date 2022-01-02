const matchActionServie = require('../services/matchAction_module')

module.exports = {
        //find by id 
        findByIdmatchActionsRoute:(res,id) =>{
            matchActionServie.findById(res,id).then(function (result) {
                res.status(200).json(result)    
        })
    },
//add matchAction
    addmatchActionRoute:(req,res)=>{
        try {
            matchActionServie.addmatchAction(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete matchAction route
    deletematchActionRoute: (id,res)=>{
        try {
            matchActionServie.deletematchActionById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update matchAction route
    updatematchActionRoute:(id,reqBody,res)=>{
        try {

            matchActionServie.updatematchAction(reqBody,id,res)
        } catch (error) {
            console.log(error)
        }
    },
    //Group by
    findByRoutes:(res,id,char)=>{
       
        matchActionServie.findBy(res,id,char).then(function (result) {
            res.status(200).json({
                message:"matchActions by "+char,
                matchActions:result})
            }) 
 
    }
}


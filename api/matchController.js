const matchServie = require('../services/match_module')
const matchActionServie = require('../services/matchAction_module')
module.exports = {
            //find by id 
            findByIdmatchActionsRoute:(res,id) =>{
                matchServie.findById(res,id).then(function (result) {
                    res.status(200).json(result)    
            })
        },
//get all matchs 
    getAllmatchsRoute:(res) =>{
    matchServie.getAllmatchs(res).then(function (result) {
        res.status(200).json({
            message:"all matchs",
            matchs:result})
        })    
},
        //find by id 
        findByIdmatchsRoute:(res,id) =>{
            matchServie.findById(res,id).then(function (result) {
                res.status(200).json(result)    
        })
    },
            //find by id 
            findByteammatchsRoute:(res,id) =>{
                matchServie.findByteammatchs(res,id).then(function (result) {
                    res.status(200).json(result)    
            })
        },
//add match
    addmatchRoute:(req,res)=>{
        try {
            matchServie.addmatch(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete match route
    deletematchRoute: (id,res)=>{
        try {
            matchServie.deletematchById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update match route
    updatematchRoute:async(id,reqBody,res)=>{
        try {
            reqBody.goals= await matchActionServie.generateMatcheActions(reqBody.goals);
            reqBody.yellowCards= await matchActionServie.generateMatcheActions(reqBody.yellowCards);
            reqBody.redCards= await matchActionServie.generateMatcheActions(reqBody.redCards);
         
            matchServie.updatematch(reqBody,id,res)
        } catch (error) {
            console.log(error)
        }
    },
    //update matches
    updatematchesRoute:async(reqBody,res)=>{
        try {

            for await (const match of reqBody) {
              
               x= matchServie.updatematchNoReturn(match,match._id)
            }

            res.status(203).json("matches updated sucessfully")
           
        } catch (error) {
            console.log(error)
            res.status(404).json(error.message)
        }
    },
   
}


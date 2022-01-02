const history_teamSchema = require('../models/history_team')
var resMsg = {
    message:String
}
module.exports = {
    addhistory_team: async (req,res) => {
      try {
          await new history_teamSchema(req.body).save(function(err, result){
              if(err) {
                  resMsg.message=err
              } else {
                  resMsg.message=result._id
              }
              console.log(resMsg.message)
              res.status(201).json(resMsg)
            });
      } catch (error) {
          console.log(error.message)
          resMsg.message=error.message
          res.status(404).json(resMsg)
      }
},
findByUserInHistory:async (res,id)=>{
  try{
    return  history_teams= await history_teamSchema.find({user:id})
} catch (error) {
    console.log(error.message)
    resMsg.message=error.message
    res.status(404).json(resMsg)
}
},
findByTeamInHistory:async (res,id)=>{
  try{
    return  history_teams= await history_teamSchema.find({team:id})
} catch (error) {
    console.log(error.message)
    resMsg.message=error.message
    res.status(404).json(resMsg)
}
},
findById:async (res,id)=> {
  try{
      return  teams= await teamSchema.findOne({_id:id}).populate([
          {
            path: 'user',
            model: 'skills',
            populate: {
              path: 'player',
              model: 'user',
            }
          },
        ]).populate([
          {
            path: 'team',
            model: 'team'
          },
        ])
  } catch (error) {
      console.log(error.message)
      resMsg.message=error.message
      res.status(404).json(resMsg)
  }
},
getAllHistory:async (res)=> {
    try{
        return  history_teams= await history_teamSchema.find({}).populate([
          {
            path: 'user',
            model: 'skills',
            populate: {
              path: 'player',
              model: 'user',
            }
          },
        ]).populate([
          {
            path: 'team',
            model: 'team'
          },
        ])
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
},
deleteHistoryById:async (id,res)=>{
    try {
        await history_teamSchema.findByIdAndDelete(id)
        resMsg.message="history_team deleted successfully in mongoDB  !"
        res.status(201).json(resMsg)
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
    
    console.log('history_team deleted successfully in mongoDB !')
},
updatehistory_team:async (history_team,id,res)=>{
    try{
        await history_teamSchema.findByIdAndUpdate({_id:id},history_team)
        resMsg.message="history_team updated successfully in mongoDB !"
        res.status(201).json(resMsg)
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
    console.log('history_team updated successfully in mongoDB !')
}
}
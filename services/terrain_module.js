const terrainSchema = require('../models/terrain')
var resMsg = {
    message:String
}
module.exports = {
    addterrain: async (req,res) => {
        try {
            await new terrainSchema(req.body).save()
            resMsg.message="terrain added successfully in mongoDB  !"
            console.log('terrain added successfully in mongoDB  !')
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message=error.message
            res.status(404).json(resMsg)
        }
},
getAllterrains:async (res)=> {
    try{
   return  terrains= await terrainSchema.find({}).populate("availabilities")
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
},
deleteterrainById:async (id,res)=>{
    try {
        await terrainSchema.findByIdAndDelete(id)
        resMsg.message="terrain deleted successfully in mongoDB  !"
        res.status(201).json(resMsg)
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
    
    console.log('terrain deleted successfully in mongoDB !')
},
updateterrain:async (terrain,id)=>{
    try{
        await terrainSchema.findByIdAndUpdate({_id:id},terrain)
        resMsg.message="terrain updated successfully in mongoDB !"
        res.status(201).json(resMsg)
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
    console.log('terrain updated successfully in mongoDB !')
}
}
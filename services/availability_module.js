const availabilitySchema = require('../models/availability')
var resMsg = {
    message:String
}
module.exports = {
    addavailability: async (req,res) => {
        try {
            await new availabilitySchema(req.body).save()
            resMsg.message="availability added successfully in mongoDB  !"
            console.log('availability added successfully in mongoDB  !')
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message=error.message
            res.status(404).json(resMsg)
        }
},
getAllavailabilitys:async (res)=> {
    try{
   return  availabilitys= await availabilitySchema.find({}).populate("terrain")
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
},
deleteavailabilityById:async (id,res)=>{
    try {
        await availabilitySchema.findByIdAndDelete(id)
        resMsg.message="availability deleted successfully in mongoDB  !"
        res.status(201).json(resMsg)
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
    
    console.log('availability deleted successfully in mongoDB !')
},
updateavailability:async (availability,id)=>{
    try{
        await availabilitySchema.findByIdAndUpdate({_id:id},availability)
        resMsg.message="availability updated successfully in mongoDB !"
        res.status(201).json(resMsg)
    } catch (error) {
        console.log(error.message)
        resMsg.message=error.message
        res.status(404).json(resMsg)
    }
    console.log('availability updated successfully in mongoDB !')
}
}
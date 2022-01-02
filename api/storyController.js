const storyServie = require('../services/story_module')

module.exports = {
//get all storys 
    getAllstorysRoute:(res,page) =>{
    storyServie.getAllstorys(res,page).then(function (result) {
        res.status(200).json({
            message:"all storys",
            storys:result})
        })    
},
//add story
    addstoryRoute:(req,res)=>{
        try {
            storyServie.addstory(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete story route
    deletestoryRoute: (id,res)=>{
        try {
            storyServie.deletestoryById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
    findByCreatorRoute:(res,id) =>{
        storyServie.findByCreator(res,id).then(function (result) {
            res.status(200).json({
                message:"all storys",
                storys:result})
            })  
},
findByIdstorysRoute:(res,id) =>{
    storyServie.findById(res,id).then(function (result) {
        res.status(200).json({
            message:"story",
            story:result})
        })  
},


//update story route
    updatestoryRoute:(id,reqBody,res)=>{
        try {
            var story = {
                storyName:reqBody.storyName,
                storyAmount:reqBody.storyAmount,
                dateCreation:reqBody.dateCreation,
                type:reqBody.type
            }
            storyServie.updatestory(story,id,res)
        } catch (error) {
            console.log(error)
        }
    }
    ///like story
    ,likestoryRoute:(id,userId,res)=>{
        try {
            storyServie.likestory(id,userId,res)
        } catch (error) {
            console.log(error)
        }
    },
    dislikestoryRoute:(id,userId,res)=>{
        try {
            storyServie.dislikstory(id,userId,res)
        } catch (error) {
            console.log(error)
        }
    }
    ,viewstoryRoute:(id,userId,res)=>{
        try {
            storyServie.viewstory(id,userId,res)
        } catch (error) {
            console.log(error)
        }
    },
}


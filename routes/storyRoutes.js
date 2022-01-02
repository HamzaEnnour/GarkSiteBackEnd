var story = require('../api/storyController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    app.get('/all_storys/:page',passport.authentification,(req,res) =>{var page=req.params.page;story.getAllstorysRoute(res,page)})
    app.post('/add_story',passport.authentification,(req,res) =>{story.addstoryRoute(req,res)})
    app.delete('/delete_story/:id',passport.authentification,(req,res) =>{story.deletestoryRoute(req.params.id,res)})
    app.put('/update_story/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;story.updatestoryRoute(id,reqBody,res)})
    app.get('/findByIdstory/:id',passport.authentification,(req,res) =>{var id =req.params.id;story.findByIdstorysRoute(res,id)})
    //find by creator 
    app.get('/findByCreatorstory/:id',passport.authentification,(req,res) =>{var id =req.params.id;story.findByCreatorRoute(res,id)})
    //like story
    app.put('/like_story/:id/:userId',passport.authentification,(req,res) =>{var id =req.params.id;var userId =req.params.userId;story.likestoryRoute(id,userId,res)})
    //dislike story
    app.put('/dislike_story/:id/:userId',passport.authentification,(req,res) =>{var id =req.params.id;var userId =req.params.userId;story.dislikestoryRoute(id,userId,res)})
    //view story
    app.put('/view_story/:id/:userId',passport.authentification,(req,res) =>{var id =req.params.id;var userId =req.params.userId;story.viewstoryRoute(id,userId,res)})    
}
var getRessources = require('../api/getRessourcesController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
//////////////////////////////////////////Update player and club information ///////////////////////////////////////
/////Tet3mal mara fel 3am 5ater ta5ou barcha wa9t 
//Player
 //////(Mise à jour)
 //app.put('/updateAllPlayers',(req,res) =>{getRessources.updateAllPlayers(res)})
 //app.put('/affectPlayersToContry',(req,res) =>{getRessources.affectPlayersToContry(res)})
 //Club
 //////(Mise à jour)
 //app.put('/updateAllClubs',(req,res) =>{getRessources.updateAllClubs(res)})
 //app.put('/affectClubssToContry',(req,res) =>{getRessources.affectClubssToContry(res)})

 //GET ALL
 app.get('/getAllCountries/:limit/:like',passport.authentification,(request,response)=>{getRessources.getAllCountries(request,response)});
 app.get('/getAllPlayers/:country/:limit/:like',passport.authentification,(request,response)=>{getRessources.getAllPlayers(request,response)});
 app.get('/getAllClubs/:country/:limit/:like',passport.authentification,(request,response)=>{getRessources.getAllClubs(request,response)});

}
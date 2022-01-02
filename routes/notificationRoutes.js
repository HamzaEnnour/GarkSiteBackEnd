var notification = require('../api/notificationController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
app.post('/add_notification',passport.authentification,(req,res) =>{notification.addnotificationRoute(req,res)})
app.delete('/delete_notification/:id',passport.authentification,(req,res) =>{notification.deletenotificationRoute(req.params.id,res)})
app.put('/update_notification/:id',passport.authentification,(req,res) =>{var id =req.params.id;var reqBody=req.body;notification.updatenotificationRoute(id,reqBody,res)})
}
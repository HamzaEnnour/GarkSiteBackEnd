const notificationServie = require('../services/notification_module')

module.exports = {


//add notification
    addnotificationRoute:(req,res)=>{
        try {
            notificationServie.addnotification(req,res)
        } catch (error) {
            console.log(error);
        }
    },
//delete notification route
    deletenotificationRoute: (id,res)=>{
        try {
            notificationServie.deletenotificationById(id,res)
        } catch (error) {
            console.log(error)
        }
    },
//update notification route
    updatenotificationRoute:(id,reqBody,res)=>{
        try {
            var notification = {
                //notificationName:reqBody.notificationName,
               // notificationAmount:reqBody.notificationAmount,
              //  dateCreation:reqBody.dateCreation,
              //  type:reqBody.type
            }
            notificationServie.updatenotification(notification,id,res)
        } catch (error) {
            console.log(error)
        }
    }
}


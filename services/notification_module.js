var firestoreConfig = require('../config/firestoreConfig');
const notificationSchema = require('../models/notification')
const skillsSchema = require('../models/skills')
const userSchema = require('../models/user')
const teamSchema = require('../models/team')
var resMsg = {
    message: String
}
var func = module.exports = {
    addnotification: async (req, res) => {
        try {
            var x = await new notificationSchema(req.body).save()
            if (x.notificationType == "CaptinAcceptedYourRequest"
            ) {
                var elementPlayer = await skillsSchema.findOne({ player: req.body.to })
                await skillsSchema.findOneAndUpdate
                    ({ player: req.body.to }, { $push: { teams: x.content } })
                await teamSchema.findByIdAndUpdate({ _id: x.content }, { $push: { substitutes: elementPlayer._id } })
            } else if (x.notificationType == "PlayerAcceptedYourInvitation") {
                var elementPlayer = await skillsSchema.findOne({ player: req.body.from })
                await skillsSchema.findOneAndUpdate
                    ({ player: req.body.from }, { $push: { teams: x.content } })
                await teamSchema.findByIdAndUpdate({ _id: x.content }, { $push: { substitutes: elementPlayer._id } })
            }

            await skillsSchema.findOneAndUpdate({ player: req.body.to }, { $push: { notifications: x._id } })
          try {
            var reciverId;
            if (typeof (req.body.to) != String) {
                reciverId = String(req.body.to)
            } else {
                reciverId=req.body.to
            }
            const userRef = firestoreConfig.firestore.collection('users').doc(reciverId);
            const userFCMToken = (await userRef.get()).data()['fcmToken'];
            const msgFromUser = await userSchema.findOne({ '_id': req.body.from });
            var obj = new Object();
            obj.msgValue = req.body.notificationType;
            obj.type = "notification";
            obj.chatroomId = reciverId;
            obj.image = msgFromUser.photo;
            obj.from = msgFromUser.firstName + " " + msgFromUser.lastName + " " + req.body.notificationType;
            var jsonString = JSON.stringify(obj);
            const message = {
                notification: {
                    title: "notification",
                    body: obj.msgValue,
                },
                token: userFCMToken,
                data: {
                    body: jsonString,
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                    status: "done",
                }

            }
            
            firestoreConfig.admin.messaging().send(message)
                .then(response => {
                    console.log('Notification sent successfully');

                })
                .catch(error => {
                    console.log(error);
                });
          } catch (error) {
            console.log(error.message)
          }
            resMsg.message = "notification added successfully in mongoDB  !"
            if (res != null)
                res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            if (res != null)
                res.status(404).json(resMsg)
        }
    },
    getAllnotifications: async (res, userid) => {
        try {
            return notifications = await notificationSchema.find({ user: userid })
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    deletenotificationById: async (id, res) => {
        try {
            var x = await notificationSchema.findOne({ _id: id });

            await skillsSchema.findOneAndUpdate({ player: x.to }, { $pull: { notifications: id } })
            await notificationSchema.deleteOne(x)
            resMsg.message = "notification deleted successfully in mongoDB  !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }

        console.log('notification deleted successfully in mongoDB !')
    },
    updatenotification: async (notification, id, res) => {
        try {
            await notificationSchema.findByIdAndUpdate({ _id: id }, { seen: true })
            resMsg.message = "notification updated successfully in mongoDB !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('notification updated successfully in mongoDB !')
    },
    sendNotifToFollowers: async (from, notifType, notifContent) => {

        var sender = await skillsSchema.findOne({ player: from }).populate({
            path: "followers", populate: {
                path: 'player'
            }
        });

        for await (const follower of sender.followers) {
            var notification = {
                notificationType: notifType,
                from: from,
                content: notifContent,
                to: String(follower.player._id)
            }
            var req = {
                body: notification
            }
            await func.addnotification(req, null);

        }
        return "done";
    }
}


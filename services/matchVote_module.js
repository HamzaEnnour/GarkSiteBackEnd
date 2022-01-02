const matchVoteSchema = require('../models/matchVote')
var userSchema = require('../models/user.js');
const transactionSchema = require('../models/transaction')
const skillsSchema = require('../models/skills')
const notificationServie = require('../services/notification_module')
var resMsg = {
    message: String
}
module.exports = {
    addmatchVote: async (req, res) => {
        var voterUser=await userSchema.findByIdAndUpdate({ _id: req.body.voter }, { $inc: {wallet: 0.125 } })
        try {
            var transaction = {
                "transactionType": "Vote",
                "amount": 0.125,
                "senderWallet": voterUser.wallet,
                "from": process.env.idAdmin,//Gark assistance ID
                "to": voterUser._id,
                "substraction": true
            }
            await transactionSchema(transaction).save()
            
            if (req.body.voteType == "Player") {
                await skillsSchema.findOneAndUpdate({ player: req.body.votedOnPlayer }, { $push: { votes:voterUser._id } })
                var to = await userSchema.findById({ _id: req.body.votedOnPlayer });
                var notification = {
                    "notificationType": "UserVotedOnYou",
                    "content": voterUser._id,
                    "from": voterUser._id,
                    "to": to._id,
                }
                var dd = {
                    "body": notification,
                }
          
                await notificationServie.addnotification(dd,null)
            }

            await new matchVoteSchema(req.body).save()
            resMsg.message = "matchVote added successfully in mongoDB  !"
            console.log('matchVote added successfully in mongoDB  !')
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    VotesByVoter: async (res, userid) => {
        try {
            return matchVotes = await matchVoteSchema.find({ voter: userid })
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    getAllmatchVotes: async (res, userid) => {
        try {
            return matchVotes = await matchVoteSchema.find({ votedOn: userid })
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    deletematchVoteById: async (id, res) => {
        try {
            await matchVoteSchema.findByIdAndDelete(id)
            resMsg.message = "matchVote deleted successfully in mongoDB  !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }

        console.log('matchVote deleted successfully in mongoDB !')
    },
    updatematchVote: async (matchVote, id) => {
        try {
            await matchVoteSchema.findByIdAndUpdate({ _id: id }, matchVote)
            resMsg.message = "matchVote updated successfully in mongoDB !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('matchVote updated successfully in mongoDB !')
    }
}
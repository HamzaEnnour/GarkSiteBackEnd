const transactionSchema = require('../models/transaction')
const userSchema = require('../models/user')
const blackListSchema = require('../models/blackList')
var requestIp = require('request-ip');
const teamSchema = require('../models/team')
const skillsSchema = require('../models/skills')
var resMsg = {
    message: String
}
function extractInfoToBlackList(req, suspect, reason) {
    var clientIp = requestIp.getClientIp(req);
    var bl = {
        "suspect": suspect._id,
        "description": reason,
        "ip_adress": clientIp,
        "illegalTransaction": req.body
    };

    return bl;
}

async function userVerifyTransaction(user, req) {
    if (Math.abs(user.wallet) < Math.abs(req.body.senderWallet)) {
        var bl = extractInfoToBlackList(req, user, "user.wallet < req.body.senderWallet")
        await userSchema.findByIdAndUpdate({ _id: user._id }, { blackListed: true })
        await blackListSchema(bl).save();
        return false;
    }
    if (Math.abs(user.wallet) - Math.abs(req.body.amount) < 0) {
        var bl = extractInfoToBlackList(req, user, "user.wallet - req.body.amount < 0")
        await userSchema.findByIdAndUpdate({ _id: user._id }, { blackListed: true })
        await blackListSchema(bl).save();
        return false;
    }

    var transactions = await transactionSchema.find({ $or: [{ from: user._id }, { to: user._id }] })
    var currentWallet = 0;
    transactions.forEach(element => {
       var substraction= element.from==user._id?true:false;
        if (!substraction) {
            currentWallet += element.amount;
        } else {
            currentWallet -= element.amount;
        }
    });
    if (currentWallet < req.body.senderWallet) {
        var bl = extractInfoToBlackList(req, user, "somme(transactions)<req.body.senderWallet")
        await userSchema.findByIdAndUpdate({ _id: user._id }, { blackListed: true })
        await blackListSchema(bl).save();
        return false;
    }
    return true;
}

async function teamVerifyTransaction(team, req) {
    if (Math.abs(team.moneybox) < Math.abs(req.body.senderWallet)) {
        var user = await skillsSchema.findOne({ _id: team.capitaine }).populate("player")
        var bl = extractInfoToBlackList(req, user.player, "team.moneybox < req.body.senderWallet")
        Object.assign(bl, { "team": team._id });
        await blackListSchema(bl).save();
        await userSchema.findByIdAndUpdate({ _id: user.player._id }, { blackListed: true })
        await teamSchema.findByIdAndUpdate({ _id: team._id }, { blackListed: true })

        return false;
    }
    if (Math.abs(team.moneybox) - Math.abs(req.body.amount) < 0) {
        var user = await skillsSchema.findOne({ _id: team.capitaine }).populate("player")
        var bl = extractInfoToBlackList(req, user.player, "team.moneybox  - req.body.amount < 0")
        Object.assign(bl, { "team": team._id });
        await userSchema.findByIdAndUpdate({ _id: user.player._id }, { blackListed: true })
        await teamSchema.findByIdAndUpdate({ _id: team._id }, { blackListed: true })
        await blackListSchema(bl).save();
        return false;
    }
    var transactions = await transactionSchema.find({ teamTarget:team._id })
    var currentMoneyBox = 0;
    transactions.forEach(element => {
        var substraction= element.from==team.capitaine.player._id?true:false;
        if (!substraction) {
            currentMoneyBox += element.amount;
        } else {
            currentMoneyBox -= element.amount;
        }
    });
    if (currentMoneyBox < req.body.senderWallet) {
        var user = await skillsSchema.findOne({ _id: team.capitaine }).populate("player")
        var bl = extractInfoToBlackList(req, user.player, "somme(transactions)<req.body.senderMoneyBox")
        await userSchema.findByIdAndUpdate({ _id: user.player._id }, { blackListed: true })
        await teamSchema.findByIdAndUpdate({ _id: team._id }, { blackListed: true })
        Object.assign(bl, { "team": team._id });
        await blackListSchema(bl).save();
        return false;
    }
    return true;
}

module.exports = {
    addTransaction: async (req, res) => {
        try {
            allow = false;
            var userSender = await userSchema.findById({ _id: req.body.from })
            if (userSender.role == "admin" &&
                (req.body.transactionType == "GarkAdminToUser" ||
                    req.body.transactionType == "GarkAdminToTeam")
            ) {
                allow = true
            }
            else if (req.body.transactionType == "fromUserToUser" ||
                req.body.transactionType == "fromUserToTeam") {
                allow = await userVerifyTransaction(userSender, req)
            } else if (req.body.transactionType == "TeamToChallenge") {
                var team = await teamSchema.findById({ _id:req.body.teamTarget }).populate([
                    {
                      path: 'capitaine',
                      model: 'skills',
                      populate: {
                        path: 'player',
                        model: 'user',
                      }
                    },
                  ])
                allow = await teamVerifyTransaction(team, req)
                req.body.to = process.env.idAdmin;
            } else {
                var user = {
                    _id: req.body.from
                }
                var bl = extractInfoToBlackList(req, user, JSON.stringify(req.body))
                await blackListSchema(bl).save();
            }
            if (allow) {
                await new transactionSchema(req.body).save(async function (err, result) {
                    if (err) {
                        console.log(error.message)
                        resMsg.message = error.message
                        res.status(404).json(resMsg)
                    } else {
                        if (req.body.transactionType == "fromUserToUser") {
                            try {   //Sender
                                var newWallet = Math.abs(userSender.wallet) - Math.abs(result.amount);
                                await userSchema.findByIdAndUpdate({ _id: userSender._id }, { wallet: newWallet })
                                //Reciver
                                var userReciver = await userSchema.findById({ _id: req.body.to })
                                newWallet = Math.abs(userReciver.wallet) + Math.abs(result.amount);
                                await userSchema.findByIdAndUpdate({ _id: userReciver._id }, { wallet: newWallet })
                                allow = true;
                            } catch (error) {
                                console.log(error.message)
                            }
                        } else if (req.body.transactionType == "fromUserToTeam") {
                            try {  //Sender
                                var newWallet = Math.abs(userSender.wallet) - Math.abs(result.amount);
                                await userSchema.findByIdAndUpdate({ _id: userSender._id }, { wallet: newWallet })
                                //Reciver
                                var teamReciver = await teamSchema.findById({ _id: req.body.teamTarget })
                                newWallet = Math.abs(teamReciver.moneybox) + Math.abs(result.amount);
                                await teamSchema.findByIdAndUpdate({ _id: teamReciver._id }, { moneybox: newWallet })
                                allow = true;
                            } catch (error) {
                                console.log(error.message)
                            }
                        }
                        else if (req.body.transactionType == "TeamToChallenge") {
                            //Sender
                            try {
                                var team = await teamSchema.findById({ _id: req.body.teamTarget })
                                var newMoneyBox = Math.abs(team.moneybox) - Math.abs(result.amount);
                                await teamSchema.findByIdAndUpdate({ _id: team._id }, { moneybox: newMoneyBox })
                                allow = true;
                            } catch (error) {
                                console.log(error.message)
                            }
                        } else if (req.body.transactionType == "GarkAdminToUser") {
                            try {
                                var userReciver = await userSchema.findById({ _id: req.body.to })
                                var newWallet = Math.abs(userReciver.wallet) + Math.abs(result.amount);
                                await userSchema.findByIdAndUpdate({ _id: req.body.to }, { wallet: newWallet })
                                allow = true;
                            } catch (error) {
                                console.log(error.message)
                            }
                        } else if (req.body.transactionType == "GarkAdminToTeam") {
                            try {
                                var team = await teamSchema.findById({ _id: req.body.teamTarget })
                                var newMoneyBox = Math.abs(team.moneybox) + Math.abs(result.amount);
                                await teamSchema.findByIdAndUpdate({ _id: team._id }, { moneybox: newMoneyBox })

                            } catch (error) {
                                console.log(error.message)
                            }
                        } else {
                            console.log("fama mochkla lenna")
                            allow = true;
                        }
                    }
                });
            }
            return allow;
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }



    },
    findById: async (res, id) => {
        try {
            return transaction = await (await transactionSchema.findOne({ _id: id })).populate("from").populate("to").populate("teamTarget")
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    getAllTransactionsByUser: async (res, userId,page) => {
        try {
            var skip=parseInt(page)*40;
          return await transactionSchema.find({ $or: [{ from: userId }, { to: userId }] }) .sort({date_transaction:'descending'}).skip(skip).populate("from").populate("to").populate("teamTarget")
    
            }
   catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },

}
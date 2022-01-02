const matchSchema = require('../models/match')
var userSchema = require('../models/user.js');
const transactionSchema = require('../models/transaction')
const skillsSchema = require('../models/skills')
const teamSchema = require('../models/team')
const challengeSchema = require('../models/challenge')
const notificationServie = require('../services/notification_module')
var resMsg = {
  message: String
}
async function distributeGCTOMATCH(match) {
  //Semi
  if (match.type == "Semi") {

    var challenge = await challengeSchema.findOne({ matches: { $in: match._id } })
    var team1 = await teamSchema.findOne({ _id: match.team1 })
    var team2 = await teamSchema.findOne({ _id: match.team2 })

    ///TEAM 1
    var captinTeam1 = await skillsSchema.findOneAndUpdate({ _id: team1.capitaine }, { $inc: { xp: 2 } }).populate("player")

    if (challenge.maxNumberOfTeams == 8) {
      var transaction = {
        "transactionType": "Semi",
        "amount": 1,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinTeam1.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()

      await userSchema.findByIdAndUpdate({ _id: captinTeam1.player._id }, { $inc: { wallet: 1 } })

    } else {
      var transaction = {
        "transactionType": "Semi",
        "amount": 2,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinTeam1.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinTeam1.player._id }, { $inc: { wallet: 2 } })
    }
    team1.titulares.forEach(async element => {
      var skills = await skillsSchema.findOneAndUpdate({ _id: element }, { $inc: { xp: 2 } }).populate("player")
      if (challenge.maxNumberOfTeams == 8) {
        var transaction = {
          "transactionType": "Semi",
          "amount": 1,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 1 } })
      } else {
        var transaction = {
          "transactionType": "Semi",
          "amount": 2,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 2, xp: 2 } })
      }
    });
    ///TEAM 2
    var captinTeam2 = await skillsSchema.findOneAndUpdate({ _id: team2.capitaine }, { $inc: { xp: 2 } }).populate("player")
    if (challenge.maxNumberOfTeams == 8) {
      var transaction = {
        "transactionType": "Semi",
        "amount": 1,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinTeam2.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinTeam2.player._id }, { $inc: { wallet: 1 } })
    } else {
      var transaction = {
        "transactionType": "Semi",
        "amount": 2,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinTeam2.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinTeam2.player._id }, { $inc: { wallet: 2 } })
    }
    team2.titulares.forEach(async element => {
      var skills = await skillsSchema.findOneAndUpdate({ _id: element }, { $inc: { xp: 1 } }).populate("player")

      if (challenge.maxNumberOfTeams == 8) {
        var transaction = {
          "transactionType": "Semi",
          "amount": 1,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 1 } }).populate("player")
      } else {
        var transaction = {
          "transactionType": "Semi",
          "amount": 2,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 2 } })
      }
    });

  } else if (match.type == "Final") {
    var challenge = await challengeSchema.findOne({ matches: { $in: match._id } })
    if (match.team1 == match.winner) {
      var winner = await teamSchema.findOne({ _id: match.team1 })
      var looser = await teamSchema.findOne({ _id: match.team2 })
    } else {
      var winner = await teamSchema.findOne({ _id: match.team2 })
      var looser = await teamSchema.findOne({ _id: match.team1 })
    }
    ///Winner 

    if (challenge.maxNumberOfTeams == 8) {

      var captinWinner = await skillsSchema.findOneAndUpdate({ _id: winner.capitaine }, { $inc: { xp: 340 } }).populate("player")

      var transaction = {
        "transactionType": "FirstPrize",
        "amount": 340,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinWinner.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinWinner.player._id }, { $inc: { wallet: 340 } })
    } else {
      var captinWinner = await skillsSchema.findOneAndUpdate({ _id: winner.capitaine }, { $inc: { xp: 580 } }).populate("player")

      var transaction = {
        "transactionType": "FirstPrize",
        "amount": 580,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinWinner.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinWinner.player._id }, { $inc: { wallet: 580 } })
    }
    winner.titulares.forEach(async element => {

      if (challenge.maxNumberOfTeams == 8) {
        var skills = await skillsSchema.findOneAndUpdate({ _id: element }, { $inc: { xp: 340 } }).populate("player")
        var transaction = {
          "transactionType": "FirstPrize",
          "amount": 340,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }

        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 340 } })
      } else {
        var skills = await skillsSchema.findOneAndUpdate({ _id: element }, { $inc: { xp: 580 } }).populate("player")
        var transaction = {
          "transactionType": "FirstPrize",
          "amount": 580,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }

        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 580 } })
      }
    });
    ///Looser

    if (challenge.maxNumberOfTeams == 8) {
      var captinLooser = await skillsSchema.findOneAndUpdate({ _id: looser.capitaine }, { $inc: { xp: 250 } }).populate("player")
      var transaction = {
        "transactionType": "SecoundPrize",
        "amount": 250,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinLooser.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinLooser.player._id }, { $inc: { wallet: 250 } })
    } else {
      var captinLooser = await skillsSchema.findOneAndUpdate({ _id: looser.capitaine }, { $inc: { xp: 280 } }).populate("player")

      var transaction = {
        "transactionType": "SecoundPrize",
        "amount": 280,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinLooser.player._id,
        "substraction": true
      }
      await transactionSchema(transaction).save()
      await userSchema.findByIdAndUpdate({ _id: captinLooser.player._id }, { $inc: { wallet: 280 } })
    }
    looser.titulares.forEach(async element => {

      if (challenge.maxNumberOfTeams == 8) {
        var skills = await skillsSchema.findOneAndUpdate({ _id: element }, { $inc: { xp: 250 } }).populate("player")
        var transaction = {
          "transactionType": "SecoundPrize",
          "amount": 250,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }

        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 250 } })
      } else {
        var skills = await skillsSchema.findOneAndUpdate({ _id: element }, { $inc: { xp: 280 } }).populate("player")
        var transaction = {
          "transactionType": "SecoundPrize",
          "amount": 280,
          "senderWallet": 0,
          "from": process.env.idAdmin,//Gark assistance ID
          "to": skills.player._id,
          "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 280 } })
      }
    });
  }
  //Red cards
  match.redCards.forEach(async (element) => {

    var skills = await skillsSchema.findOne({ _id: element.player })
    var transaction = {
      "transactionType": "RedCard",
      "amount": 20,
      "senderWallet": 0,
      "from": process.env.idAdmin,//Gark assistance ID
      "to": skills.player._id,
      "substraction": false
    }
    await transactionSchema(transaction).save()
    await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: -20 } })
  });
  //Yellow cards
  match.yellowCards.forEach(async (element) => {
    var skills = await skillsSchema.findOne({ _id: element.player })
    var transaction = {
      "transactionType": "YellowCard",
      "amount": 8,
      "senderWallet": 0,
      "from": process.env.idAdmin,//Gark assistance ID
      "to": skills.player._id,
      "substraction": false
    }
    await transactionSchema(transaction).save()
    await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: -8 } })
  });
  //Man of the match
  var transaction = {
    "transactionType": "ManOfTheMatch",
    "amount": 1,
    "senderWallet": 0,
    "from": process.env.idAdmin,//Gark assistance ID
    "to": match.manOfTheMatch,
    "substraction": true
  }
  await transactionSchema(transaction).save()
  await userSchema.findByIdAndUpdate({ _id: match.manOfTheMatch }, { $inc: { wallet: 1 } })
}
async function sendNotifications(object, notificationType) {
  if (notificationType = "VoteOnPlayers") {
    var team1 = await teamSchema.findOne({ _id: object.team1 })
    var team2 = await teamSchema.findOne({ _id: object.team2 })
   
    var captin1skills = await skillsSchema.findOne({ _id:  team1.capitaine }).populate("player")
    var notification = {
      "notificationType": notificationType,
      "content": object._id,
      "from": process.env.idAdmin,//Gark assistance ID
      "to": String(captin1skills.player._id),
    }
    var req = {
      "body": notification,
    }
    await notificationServie.addnotification(req, null)
    team1.titulares.forEach(async element => {
      var skills = await skillsSchema.findOne({ _id: element }).populate("player")
      var notification = {
        "notificationType": notificationType,
        "content": object._id,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": String(skills.player._id),
      }
      var req = {
        "body": notification,
      }
      await notificationServie.addnotification(req, null)
    });

    //Team 2
    var captin2skills = await skillsSchema.findOne({ _id:  team2.capitaine }).populate("player")
    var notification = {
      "notificationType": notificationType,
      "content": object._id,
      "from": process.env.idAdmin,//Gark assistance ID
      "to": String(captin2skills.player._id),
    }
    var req = {
      "body": notification,
    }
    await notificationServie.addnotification(req, null)
    team2.titulares.forEach(async element => {
      var skills = await skillsSchema.findOne({ _id: element }).populate("player")
      var notification = {
        "notificationType": notificationType,
        "content": object._id,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": String(skills.player._id),
      }
      var req = {
        "body": notification,
      }
      await notificationServie.addnotification(req, null)
    });
  }
}




module.exports = {
  addmatch: async (req) => {

    await new matchSchema(req.body).save(function (err, result) {
      if (err) {
        resMsg.message = err
        console.log(err)
        return "null"
      } else {
        console.log("req.body");
        console.log(result._id)
        return result._id
      }


    });

  },
  findById: async (res, id) => {
    try {
      return match = await matchSchema.findOne({ _id: id }).populate("goals").populate("yellowCards")
        .populate("redCards").populate("winner").populate("manOfTheMatch").populate([
          {
            path: 'team1',
            model: 'team',
            populate: [{
              path: 'titulares',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'substitutes',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'capitaine',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }],
          },
          {
            path: 'team2',
            model: 'team',
            populate: [{
              path: 'titulares',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'substitutes',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'capitaine',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }],
          },

        ])
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  findByteammatchs: async (res, id) => {
    try {
      return match = await matchSchema.find({ $or: [
        {
          team1: id,
        },
        {
          team2: id,
        },
      ]}).populate("goals").populate("yellowCards")
        .populate("redCards").populate("winner").populate("manOfTheMatch").populate([
          {
            path: 'team1',
            model: 'team',
            populate: [{
              path: 'titulares',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'substitutes',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'capitaine',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }],
          },
          {
            path: 'team2',
            model: 'team',
            populate: [{
              path: 'titulares',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'substitutes',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }, {
              path: 'capitaine',
              model: 'skills',
              populate: {
                path: 'player',
                model: 'user',
              }
            }],
          },

        ])
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  getAllmatchs: async (res) => {
    try {
      return matchs = await matchSchema.find({}).populate("team1").populate("team2")
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  deletematchById: async (id, res) => {
    try {
      await matchSchema.findByIdAndDelete(id)
      resMsg.message = "match deleted successfully in mongoDB  !"
      res.status(201).json(resMsg)
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }

    console.log('match deleted successfully in mongoDB !')
  },
  updatematch: async (match, id, res) => {
    try {

      if (match.state == "Finished") {
        await distributeGCTOMATCH(match);

        await sendNotifications(match, "VoteOnPlayers")

      }
      await matchSchema.findByIdAndUpdate({ _id: id }, match)
      resMsg.message = "match updated successfully in mongoDB !"
      res.status(201).json(resMsg)
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
    console.log('match updated successfully in mongoDB !')
  },
  //update with no return res
  updatematchNoReturn: async (match, id) => {
    try {
      await matchSchema.findByIdAndUpdate({ _id: id }, match)
      return "match updated successfully in mongoDB !"

    } catch (error) {
      console.log(error.message)
      return error.message
    }
  }
  , generateMatches: async (matches) => {

    var array = [];
    var i = 0;
    for await (const m of matches) {

      x = await new matchSchema({
        'start_date': matches[i].start_date,
        'state': matches[i].state,
        'type': matches[i].type
      })
        .save();

      i++;
      array.push(x);
    }
    return array;


  }
}
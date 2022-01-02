const challengeSchema = require('../models/challenge')
const teamSchema = require('../models/team')
var userSchema = require('../models/user.js');
const transactionSchema = require('../models/transaction')
const skillsSchema = require('../models/skills')
var resMsg = {
    message: String
}
async function distributeParticipation(challengeId, teamId) {
    var challenge = await challengeSchema.findOne({ _id: challengeId });
    var team = await teamSchema.findOne({ _id: teamId });
    var captinTeam = await skillsSchema.findOneAndUpdate({ _id: team.capitaine },{ $inc: {xp: 4 }}).populate("player")
    await userSchema.findByIdAndUpdate({ _id: captinTeam.player._id }, { $inc: { wallet: 4 } })
    var transaction = {
        "transactionType": "Participation",
        "amount": 4,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": captinTeam.player._id,
        "substraction": true
    }
    await transactionSchema(transaction).save()
    team.titulares.forEach(async element => {
        var skills = await skillsSchema.findOneAndUpdate({ _id: element },{ $inc: { xp: 4 } }).populate("player")
        if (challenge.maxNumberOfTeams == 8) {
            var transaction = {
                "transactionType": "Participation",
                "amount": 4,
                "senderWallet": 0,
                "from": process.env.idAdmin,//Gark assistance ID
                "to": skills.player._id,
                "substraction": true
            }

            await transactionSchema(transaction).save()
            await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 4 } })
        } else {
            var transaction = {
                "transactionType": "Participation",
                "amount": 3,
                "senderWallet": 0,
                "from": process.env.idAdmin,//Gark assistance ID
                "to": skills.player._id,
                "substraction": true
            }

            await transactionSchema(transaction).save()
            await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 3 } })
        }
    });

}
module.exports = {
    //add match to challenge
    addMatch: async (id, userId, res) => {
        try {
            await challengeSchema.findByIdAndUpdate({ _id: id }, { $push: { matches: userId } })
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('match added successfully to challenge in mongoDB !')
    },
    //add team to challenge
    add: async (id, teamId, res) => {
        try {
            await distributeParticipation(id, teamId);
            await challengeSchema.findByIdAndUpdate({ _id: id }, { $push: { teams: teamId } })
            resMsg.message = 'team added to challenge successfully in mongoDB !'
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('team added to challenge successfully in mongoDB !')
    },
    //remove team to challenge
    remove: async (id, teamId, res) => {
        try {
            var challenge = await challengeSchema.findById({ _id: id })
     
            var team = await teamSchema.findOne({ _id: teamId });
            var returnfees= team.moneybox + (challenge.fees-challenge.fees * 0.1);

            var captinTeam = await skillsSchema.findOne({ _id: team.capitaine })
            var transaction = {
                "transactionType": "LeaveChallenge",
                "amount": returnfees,
                "senderWallet": team.moneybox,
                "from": process.env.idAdmin,//Gark assistance ID
                "to": captinTeam.player._id,
                "teamTarget": teamId,
                "substraction": true
            }
            await transactionSchema(transaction).save()
            console.log(returnfees);
            await teamSchema.findByIdAndUpdate({ _id: teamId }, {moneybox: returnfees })
            await challengeSchema.findByIdAndUpdate({ _id: id }, { $pull: { teams: teamId } })
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = erfror.message
            res.status(404).json(resMsg)
        }
        console.log('team deleted successfully in mongoDB !')
    },
    findByName: async (res, name) => {
        try {
            return challenge = await challengeSchema.findOne({ name: name }).sort({ start_date: 'descending' }).populate("winner").populate("teams").populate([
                {
                    path: 'matches',
                    model: 'match',
                    populate: {
                        path: 'goals',
                        model: 'matchAction',
                    }
                },
            ])

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    getChallenges: async (res, name) => {
        try {
            return challenge = await challengeSchema.find({}).sort({ start_date: 'descending' }).populate("winner").populate("teams").populate([
                {
                    path: 'matches',
                    model: 'match',
                    populate: {
                        path: 'goals',
                        model: 'matchAction',
                    }
                },
            ])

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    findById: async (res, id) => {
        try {
            return challenge = await challengeSchema.findOne({ _id: id })
            .sort({ start_date: 'descending' }).populate("winner")
            .populate("teams").populate("creator").populate("manOfTheTournement").populate([
                {
                    path: 'matches',
                    model: 'match',
                    populate: [{
                        path: 'goals',
                        model: 'matchAction',

                    }, {
                        path: 'manOfTheMatch',
                        model: 'user',

                    }]
                },
            ])

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    addchallenge: async (req, res) => {
        try {
            var x = await challengeSchema.find({ name: req.body.name })

            if (x.length == 0) {
                await new challengeSchema(req.body).save(function (err, result) {
                    if (err) {
                        resMsg.message = err
                        res.status(404).json(resMsg.message)
                    } else {
                        resMsg.message = result._id
                        res.status(201).json(resMsg.message)
                    }
                });
            } else {
                console.log("name must be unique")
                resMsg.message = "name must be unique"
                res.status(404).json(resMsg)
            }

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    getAllchallenges: async (res, page) => {
        try {
            var skip = parseInt(page) * 10;
            return challenges = await challengeSchema.find({}).populate("winner").skip(skip).limit(10)

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    ///GetChallenge By team
    getChallengeByTeam: async (id, res) => {
        try {
            return challenges = await challengeSchema.find({ teams: { $in: id } }).populate("matches");

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
        ///GetChallenge By match
        getChallengeByMatch: async (id, res) => {
            try {
                console.log(id);
                return challenges = await challengeSchema.findOne({ matches: { $in: id } }).populate("winner")
                .populate("teams").populate("creator").populate("manOfTheTournement").populate([
                    {
                        path: 'matches',
                        model: 'match',
                        populate: [{
                            path: 'goals',
                            model: 'matchAction',

                        }, {
                            path: 'manOfTheMatch',
                            model: 'user',

                        },
                        {
                            path: 'team1',
                            model: 'team',

                        },
                        {
                            path: 'team2',
                            model: 'team',

                        }
                    ]
                    },
                ]);
    
            } catch (error) {
                console.log(error.message)
                resMsg.message = error.message
                res.status(404).json(resMsg)
            }
        },
    deletechallengeById: async (id, res) => {
        try {
            await challengeSchema.findByIdAndDelete(id)
            resMsg.message = "challenge deleted successfully in mongoDB  !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }

        console.log('challenge deleted successfully in mongoDB !')
    },
    updatechallenge: async (challenge, id, res) => {
        try {
            delete challenge["GCdistributed"];
            if (challenge.state == "Pending") {
                challenge.state == "Ongoing"
            } else if (challenge.state == "Ongoing") {
                challenge.state == "Finished"
            }
            var chal = await challengeSchema.findByIdAndUpdate({ _id: id }, challenge)
            if (chal.state == "Finished" && !chal.GCdistributed) {
                await destributeGC(chal)
                var chal = await challengeSchema.findByIdAndUpdate({ _id: id }, { GCdistributed: true })
            }
            resMsg.message = "challenge updated successfully in mongoDB !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('challenge updated successfully in mongoDB !')
    }
}
async function destributeGC(challenge) {
    if (challenge.maxNumberOfTeams == 8) {
        var skills=await skillsSchema.findOneAndUpdate({ player: challenge.manOfTheTournement },{ $inc: {xp: 5 }}).populate("player")
        var transaction = {
            "transactionType": "ManOfTheTournement",
            "amount": 5,
            "senderWallet": 0,
            "from": process.env.idAdmin,//Gark assistance ID
            "to": skills.player._id,
            "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 5} })
    } else {
        var skills= await skillsSchema.findOneAndUpdate({ player: challenge.manOfTheTournement },{ $inc: {xp: 10 }}).populate("player")
        var transaction = {
            "transactionType": "ManOfTheTournement",
            "amount": 10,
            "senderWallet": 0,
            "from": process.env.idAdmin,//Gark assistance ID
            "to": skills.player._id,
            "substraction": true
        }
        await transactionSchema(transaction).save()
        await userSchema.findByIdAndUpdate({ _id: skills.player._id }, { $inc: { wallet: 10 } })
    }
    var transaction = {
        "transactionType": "GainFromChallenge",
        "amount": challenge.gain,
        "senderWallet": 0,
        "from": process.env.idAdmin,//Gark assistance ID
        "to": challenge.creator,
        "substraction": true
    }
    await transactionSchema(transaction).save()
    await userSchema.findByIdAndUpdate({ _id: challenge.creator}, { $inc: { wallet: challenge.gain} })

}
const skillsSchema = require('../models/skills')
const notificationServie = require('../services/notification_module')
var resMsg = {
    message: String
}
module.exports = {
    //join team
    add: async (id, teamId, res) => {
        try {
            await skillsSchema.findByIdAndUpdate({ _id: id }, { $push: { teams: teamId } })

            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('player joined successfully !')
    },

    findById: async (res, id) => {
        try {
            return player = await skillsSchema.findOne({ _id: id }).populate("player").populate("teams").populate("favoritechallenges").populate("favoriteteams").populate({
                path: "favoriteplayers", populate: {
                    path: 'player'
                }
            }).populate({
                path: "followers", populate: {
                    path: 'player'
                }
            }).populate(
                {
                  path: 'notifications',
                  model: 'notification',
                  populate: {
                    path: 'from',
                    model: 'user',
                  }
                }
              ).populate('bestPlayerWorld').populate('bestPlayerLocal').populate('bestTeamLocal').populate('bestTeamWorld')
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    //findPlayerByIdskills
    findByPlayerId: async (res, id) => {
        try {
            
            var player = await skillsSchema.findOne({ player: id }).populate("stories").populate("player").populate("teams").populate("favoritechallenges").populate("favoriteteams").populate("nationality").populate({
                path: "favoriteplayers", populate: {
                    path: 'player'
                }
            })
                .populate({
                    path: "followers", populate: {
                        path: 'player'
                    }
                }).populate(
                    {
                        path: 'notifications',
                        model: 'notification',
                        populate: {
                            path: 'from',
                            model: 'user',
                        }
                    }
                ).populate('bestPlayerWorld').populate('bestPlayerLocal').populate('bestTeamLocal').populate('bestTeamWorld')
                .populate({
                    path: 'matches',
                    model: 'match',
                    populate: [{
                        path: 'team1',
                        model: 'team',
                    },
                    {
                        path: 'team2',
                        model: 'team',
                    },
                    {
                        path: 'winner',
                        model: 'team',
                    }
                    ]
                })
            return player;

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    //get top players
    getTopPlayers: async (res, page) => {
        try {
            var skip = parseInt(page) * 10;
            return topPlayers = await skillsSchema.find({ }).sort({ score: -1 }).populate("player").populate('bestPlayerWorld').populate('bestPlayerLocal').populate('bestTeamLocal').populate('bestTeamWorld').populate('nationality').skip(skip).limit(10)

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    addskills: async (req, res) => {
        try {
            await new skillsSchema(req.body).save(function (err, result) {
                if (err) {
                    resMsg.message = err
                } else {
                    resMsg.message = result._id
                }
                console.log(resMsg.message)
                res.status(201).json(resMsg)
            });

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    getAllskillss: async (res, page) => {
        try {
            var skip = parseInt(page) * 10;
            return skillss = await skillsSchema.find({ }).sort({ "score": -1 }).populate('bestPlayerWorld').populate('bestPlayerLocal').populate('bestTeamLocal').populate('bestTeamWorld').populate("player").populate("nationality").skip(skip).limit(10)



        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    deleteskillsById: async (id, res) => {
        try {
            await skillsSchema.findByIdAndDelete(id)
            resMsg.message = "skills deleted successfully in mongoDB  !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }

        console.log('skills deleted successfully in mongoDB !')
    },
    updateskills: async (skills, id, res) => {
        delete skills["bestTeamWorld"];
        delete skills["bestPlayerWorld"];
        delete skills["bestTeamLocal"];
        delete skills["bestPlayerLocal"];
        delete skills["nationality"];
        delete skills["notifications"];
        try {
            await skillsSchema.findByIdAndUpdate({ _id: id }, skills)
            resMsg.message = "skills updated successfully in mongoDB !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('skills updated successfully in mongoDB !')
    },
    addToFavoritePlayers: async (req, res) => {
        try {
            var post_data = req.body;
            const userid = post_data.userid;
            const playerid = post_data.playerid;
            var add = post_data.add;

            if (add) {
                var from = await skillsSchema.findByIdAndUpdate({ _id: userid }, { $push: { favoriteplayers: playerid  } });
                var to = await skillsSchema.findByIdAndUpdate({ _id: playerid }, { $push: { followers: userid  } });
            var notification = {
              "notificationType": "UserFollowedYou",
              "content": from.player._id,
              "from": from.player._id,
              "to": to.player._id,
            }
            var req = {
              "body": notification,
            }
            await notificationServie.addnotification(req,null)
            if(res!=null)
            res.status(200).json({ message: "player added to favorites" });
            }else{
              await skillsSchema.findByIdAndUpdate({ _id: userid }, { $pull: { favoriteplayers: playerid  } });
              await skillsSchema.findByIdAndUpdate({ _id: playerid }, { $pull: { followers: userid  } });
              if(res!=null)
              res.status(200).json({ message: "player removed from favorites" });
            }
        } catch (error) {
            console.log(error.message);
            resMsg.message = error.message;
            if(res!=null)
            res.status(404).json(resMsg);
        }


    },
    addToFavoriteTeams: async (req, res) => {
        try {
            var post_data = req.body;
            const userid = post_data.userid;
            const teamid = post_data.teamid;
            var add = post_data.add;
            if (add) {
                await skillsSchema.findByIdAndUpdate({ _id: userid }, { $push: { favoriteteams: teamid } });
                res.status(200).json({ message: "team added to favorites" });
            } else {
                await skillsSchema.findByIdAndUpdate({ _id: userid }, { $pull: { favoriteteams: teamid } });
                res.status(200).json({ message: "team removed from favorites" });
            }
        } catch (error) {
            console.log(error.message);
            resMsg.message = error.message;
            res.status(404).json(resMsg);
        }
      },
      addTofavoritechallenges: async (req, res) => {
        try {
            var post_data = req.body;
            const userid = post_data.userid;
            const challengeid = post_data.challengeid;
            var add = post_data.add;
            if (add) {
                await skillsSchema.findByIdAndUpdate({ _id: userid }, { $push: { favoritechallenges: challengeid } });
                res.status(200).json({ message: "Challenge added to favorites" });
            } else {
                await skillsSchema.findByIdAndUpdate({ _id: userid }, { $pull: { favoritechallenges: challengeid } });
                res.status(200).json({ message: "Challenge removed from favorites" });
            }
        } catch (error) {
            console.log(error.message);
            resMsg.message = error.message;
            res.status(404).json(resMsg);
        }
    },
    updateTeamPlayerBest: async (req, res) => {
        var post_data = req.body;
        const skillsId = post_data.skillsId;

        const bestTeamId = post_data.bestTeamId;
        const bestPlayerId = post_data.bestPlayerId;
        const bestTeamLocalId = post_data.bestTeamLocalId;
        const bestPlayerLocalId = post_data.bestPlayerLocalId;

        const height = post_data.height;
        const weight = post_data.weight;

        try {
            const x = await skillsSchema.findOne({ _id: skillsId })
            if(bestTeamId != null) x.bestTeamWorld = bestTeamId;
            if(bestPlayerId != null) x.bestPlayerWorld = bestPlayerId;
            if(bestTeamLocalId != null) x.bestTeamLocal = bestTeamLocalId;
            if(bestPlayerLocalId != null) x.bestPlayerLocal = bestPlayerLocalId;

            if(height != null) x.height = Number(height);
            if(weight != null) x.weight = Number(weight);
         
            await skillsSchema.findOneAndUpdate({ _id: skillsId },x);


            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('skill updated successfully !')
    },
}
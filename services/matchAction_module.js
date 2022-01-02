const matchActionSchema = require('../models/matchAction')
var resMsg = {
    message: String
}
module.exports = {
    addmatchAction: async (req, res) => {
        try {
            console.log(req.body.type)
      
            await new matchActionSchema(req.body).save(function (err, result) {
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
    ///group by 
    findBy: async (res, id, char) => {
        try {
            switch (char) {
                case "challenge":
                    return matchActions = await matchActionSchema.find({ challenge: id })
                    break;
                case "team":
                    return matchActions = await matchActionSchema.find({ team: id }).populate("match")
                    break;
                case "match":
                    return matchActions = await matchActionSchema.find({ match: id }).populate("match").populate("team").populate([
                        {
                          path: 'player',
                          model: 'skills',
                          populate: {
                            path: 'player',
                            model: 'user',
                          }
                        },
                      ])
                    break;
                default:
                    return matchActions = await matchActionSchema.find({ player: id })
                    break;
            }

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    deletematchActionById: async (id, res) => {
        try {
            await matchActionSchema.findByIdAndDelete(id)
            resMsg.message = "matchAction deleted successfully in mongoDB  !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }

        console.log('matchAction deleted successfully in mongoDB !')
    },
    updatematchAction: async (matchAction, id, res) => {
        try {
            await matchActionSchema.findByIdAndUpdate({ _id: id }, matchAction)
            resMsg.message = "matchAction updated successfully in mongoDB !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('matchAction updated successfully in mongoDB !')
    },
    generateMatcheActions: async (matchActions) => {

        var array = [];
        for await (const matchAction of matchActions) {
            x = await new matchActionSchema(matchAction).save();


            array.push(x);
        }


        return array;


    }
}
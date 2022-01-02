const storySchema = require('../models/story')
const skillsSchema = require('../models/skills')
const notificationServie = require('../services/notification_module')
const schedule = require('node-schedule');
const moment = require('moment');
var resMsg = {
    message: String
}

module.exports = {
    addstory: async (req, res) => {
        try {
            await new storySchema(req.body).save(async function (err, result) {
                if (err) {
                    resMsg.message = err
                    console.log(err)
                    res.status(404).json(err)
                } else {
                    resMsg.message = "story added successfully in mongoDB  !"

                    await skillsSchema.findOneAndUpdate({ player: result.creator }, { $push: { stories: result._id } })

                    var x = await notificationServie.sendNotifToFollowers(result.creator, "NewStory", result._id)
                    console.log(x);
                    console.log('story added successfully in mongoDB  !')
                    res.status(201).json(resMsg)
                    var rule = new schedule.RecurrenceRule();
                    let time= new Date(new Date(result.date_created).getTime() + 60 * 60 * 24 * 1000);
                    rule.year = moment(time).year();
                    rule.month = moment(time).month();
                    rule.date = moment(time).date();
                    rule.hour = moment(time).hours();
                    rule.minute = moment(time).minutes();
                    rule.second = moment(time).seconds();
                 console.log(rule);
                    try {
                        schedule.scheduleJob(rule, async function () {
                            result.expired = true;
                            await storySchema.findByIdAndUpdate({ _id: result._id }, result)
                            console.log('story expired')
                            schedule.cancelJob(this);
                        });
                    } catch (err) {
                        console.log(err)
                    }

                }
            });
        }
        catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    getAllstorys: async (res, page) => {
        try {
            var skip = parseInt(page) * 10;
            // return storys = 
            //   var uniqueCreator=await storySchema.distinct("creator",{expired:false})
            var bestViewStoriesByCreator = await storySchema.aggregate(
                [
                    { $sort: { "viewsLength": -1 } },
                    { $match: { "expired": false } },
                    {
                        $group: {
                            _id: "$creator",
                            id: { $first: '$_id' }
                        }
                    },
                    { $skip: skip },
                    { $limit: 10 }
                ]
            )
            tmp = bestViewStoriesByCreator.map(a => a.id);
            return await storySchema.find({
                '_id': {
                    $in:
                        tmp
                }
            }).populate("creator")

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    deletestoryById: async (id, res) => {
        try {
            await storySchema.findByIdAndDelete(id)
            resMsg.message = "story deleted successfully in mongoDB  !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }

        console.log('story deleted successfully in mongoDB !')
    },

    updatestory: async (story, id) => {
        try {
            await storySchema.findByIdAndUpdate({ _id: id }, story)
            resMsg.message = "story updated successfully in mongoDB !"
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('story updated successfully in mongoDB !')
    },
    findByCreator: async (res, id) => {
        try {
            return storys = await storySchema.find({ creator: id, expired: false }).sort({ date_created: 1 }).populate("creator").populate("views")

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    findById: async (res, id) => {
        try {
            return story = await storySchema.findOne({ _id: id }).populate("creator").populate("views")

        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
    },
    //like story
    likestory: async (id, userId, res) => {
        try {
            await storySchema.findByIdAndUpdate({ _id: id }, { $push: { likes: userId } })
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('story liked successfully in mongoDB !')
    },
    dislikstory: async (id, userId, res) => {
        try {
            await storySchema.findByIdAndUpdate({ _id: id }, { $pull: { likes: userId } })
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('story disliked successfully in mongoDB !')
    },
    viewstory: async (id, userId, res) => {
        try {
            await storySchema.findByIdAndUpdate({ _id: id }, { $push: { views: userId } })
            res.status(201).json(resMsg)
        } catch (error) {
            console.log(error.message)
            resMsg.message = error.message
            res.status(404).json(resMsg)
        }
        console.log('story viewed successfully in mongoDB !')
    },
}
const teamSchema = require('../models/team')
const skillsSchema = require('../models/skills')
var resMsg = {
  message: String
}
module.exports = {
  addteam: async (req, res) => {
    try {
      await new teamSchema(req.body).save(async function (err, result) {
        if (err) {
          resMsg.message = err
        } else {
          await skillsSchema.findOneAndUpdate({ _id: req.body.capitaine }, { $push: { teams: result._id } })

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
  findByCapitain: async (res, id) => {
    try {
      return teams = await teamSchema.find({ capitaine: id })
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  getTeams: async (res, id) => {
    try {
      return teams = await teamSchema.find()
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  findById: async (res, id) => {
    try {
      return teams = await teamSchema.findOne({ _id: id }).populate([
        {
          path: 'titulares',
          model: 'skills',
          populate: {
            path: 'player',
            model: 'user',
          }
        },
      ]).populate([
        {
          path: 'substitutes',
          model: 'skills',
          populate: {
            path: 'player',
            model: 'user',
          }
        },
      ]).populate("nationality").populate("secondPrizes").populate("champions").populate("participations").populate([
        {
          path: 'capitaine',
          model: 'skills',
          populate: {
            path: 'player',
            model: 'user',
          }
        },
      ])
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  getAllteams: async (res, page) => {
    try {
      var skip = parseInt(page) * 10;



      var teams = await teamSchema.aggregate([
        {
          $addFields: {
            match_count: { $add: [{ $size: { "$ifNull": ["$victories", []] } }, { $size: { "$ifNull": ["$defeats", []] } }, { $size: { "$ifNull": ["$draws", []] } }] }
          }
        },
        {
          $addFields: {
            victories_count: { $size: { "$ifNull": ["$victories", []] } }
          }
        },
        {
          $sort: { "match_count": -1, "victories_count": -1 }
        }

        ,
        {
          $skip: skip
        },

      ])
      var array = [];
      var value = teams.length >= 10 ? 10 : teams.length;
      for (var i = 0; i < value; i++) {
        array.push(teams[i]);
      }
      return array;
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
  },
  deleteteamById: async (id, res) => {
    try {
      await teamSchema.findByIdAndDelete(id)
      resMsg.message = "team deleted successfully in mongoDB  !"
      res.status(201).json(resMsg)
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }

    console.log('team deleted successfully in mongoDB !')
  },
  updateteam: async (team, id, res) => {
    try {
      delete team["moneybox"];
      delete team["blackListed"];
      delete team["nationality"];
      await teamSchema.findByIdAndUpdate({ _id: id }, team)

      resMsg.message = "team updated successfully in mongoDB !"
      res.status(201).json(resMsg)
    } catch (error) {
      console.log(error.message)
      resMsg.message = error.message
      res.status(404).json(resMsg)
    }
    console.log('team updated successfully in mongoDB !')
  },
}
const teamServie = require('../services/team_module')

module.exports = {
    //find by id 
    findByIdteamsRoute: (res, id) => {
        teamServie.findById(res, id).then(function (result) {
            res.status(200).json(result)
        })
    },
    findByCapitainId: (res, id) => {
        teamServie.findByCapitain(res, id).then(function (result) {
            res.status(200).json({   message: "all teams",
            teams: result})
        })
    },
    getTeams: (res) => {
        teamServie.getTeams(res).then(function (result) {
            res.status(200).json({   message: "all teams",
            teams: result})
        })
    },
    //get all teams 
    getAllteamsRoute: (res,page) => {
        teamServie.getAllteams(res,page).then(function (result) {
            res.status(200).json({
                message: "all teams",
                teams: result
            })
        })
    },
    //add team
    addteamRoute: async (req, res) => {
        try {
            var allowInsert = true;
            await teamServie.getAllteams(res).then(async (teams) => {
                teams.forEach((team) => {
                    if (allowInsert) {
                        if (team.name == req.body.name) {
                            allowInsert = false;
                        }
                    }
                });
            });
            if (allowInsert) {
                teamServie.addteam(req, res);
            } else {
                res.status(200).json({ message: "Team name already exists" });
            }
        }catch(error) {
            console.log(error);
        }
},
    //delete team route
    deleteteamRoute: (id, res) => {
        try {
            teamServie.deleteteamById(id, res)
        } catch (error) {
            console.log(error)
        }
    },
        //update team route
        updateteamRoute: (id, reqBody, res) => {
            try {
                teamServie.updateteam(reqBody, id, res)
            } catch (error) {
                console.log(error)
            }
        },

        addToFavoriteTeams:(req,res)=>{
            try {
                teamServie.addToFavoriteTeams(req,res);
            } catch (error) {
                console.log(error);
            }
        }
}


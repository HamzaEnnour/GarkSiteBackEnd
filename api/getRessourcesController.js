let xml2js = require('xml2js');
const playerSchema = require('../models/player')
const clubSchema = require('../models/club')
const nationalitySchema = require('../models/nationality')
const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectId;

module.exports = {
    //Players
    updateAllPlayers: (res) => {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'https://fr.soccerwiki.org/download-data.php',
            'headers': {
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="92", "Opera";v="78"',
                'sec-ch-ua-mobile': '?0',
                'Upgrade-Insecure-Requests': '1',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.147',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Cookie': 'PHPSESSID=jdvpcmg2j321k5l08lejfs6t4iic2rfj; __cf_bm=92ed1d75476948335c10951430e00a437b3f4fbd-1629964807-1800-ARgA1Ogun6F+FIu/aubyju96nKP3LJoS0qDGlU8xXH+rMEqAW3lQ4Xbmw8LSXahrFYQYXqs0ZCbzFA8eZJAKbrM='
            },
            form: {
                'countryId': '',
                'format': '1',
                'options[]': 'PlayerData',
                'submit': 'Télécharger les données'
            }
        };
        request(options, async function (error, response) {
            if (error) throw new Error(error);

            xml2js.parseString(response.body.replace(/[\n\r]/g, ' ')
                .replace(/&/g, "and")
                .replace(/-/g, " "), async (err, result) => {
                    if (err) {
                        throw err;
                    }
                    result["PackData"]["PlayerData"][0]["P"].forEach(async element => {
                        var _id = element["$"]["id"];
                        var numberOfAddedZeros = 12 - _id.length
                        var zeroArray = "";
                        for (var i = 0; i < numberOfAddedZeros; i++) {
                            zeroArray = zeroArray + "0";
                        }
                        element["$"]["id"] = element["$"]["id"] + zeroArray;
                        if (element["$"]["i"] == "") element["$"]["i"] = "Not mentioned"
                        var player = {
                            "_id": element["$"]["id"],
                            "firstName": element["$"]["f"],
                            "lastName": element["$"]["s"],
                            "image": element["$"]["i"],
                        }
                        try {
                            await new playerSchema(player).save()
                        } catch (error) {
                            console.log("this player already exist")
                        }
                    });
                    res.status(200).json("Updating players in progress don't shutdown the server")
                });
        });
    },
    affectPlayersToContry: async (res) => {
        var request = require('request');
        var contryCodes = ["AFG",
            "ALB",
            "ALG",
            "AND",
            "ANG",
            "AIA",
            "ANT",
            "ARG",
            "ARM",
            "ABW",
            "AUS",
            "AUT",
            "AZE",
            "BHS",
            "BHR",
            "BGD",
            "BRB",
            "BLR",
            "BEL",
            "BLZ",
            "BEN",
            "BOL",
            "BIH",
            "BOT",
            "BRA",
            "BRN",
            "BUL",
            "BFA",
            "BDI",
            "KHM",
            "CMR",
            "CAN",
            "CPV",
            "CAR",
            "CHA",
            "CHI",
            "CHN",
            "COL",
            "COM",
            "CON",
            "CRC",
            "CRO",
            "CUB",
            "CYP",
            "CZE",
            "DEN",
            "DJI",
            "DOM",
            "COD",
            "ECU",
            "EGY",
            "ELS",
            "ENG",
            "EQG",
            "ERI",
            "EST",
            "ETH",
            "FRO",
            "FJI",
            "FIN",
            "FRA",
            "PYF",
            "GAB",
            "GAM",
            "GEO",
            "GER",
            "GHA",
            "GIB",
            "GRE",
            "GRN",
            "GUA",
            "GUI",
            "GNB",
            "GUY",
            "HAI",
            "HON",
            "HKG",
            "HUN",
            "ISL",
            "IND",
            "IDN",
            "IRN",
            "IRQ",
            "IRL",
            "ISR",
            "ITA",
            "CIV",
            "JAM",
            "JPN",
            "JOR",
            "KAZ",
            "KEN",
            "KIR",
            "KOR",
            "KWT",
            "KGZ",
            "LAO",
            "LVA",
            "LEB",
            "LBR",
            "LIB",
            "LTU",
            "LUX",
            "MCA",
            "MWI",
            "MYS",
            "MDV",
            "MLI",
            "MLT",
            "MRT",
            "MRI",
            "MEX",
            "MOL",
            "MNG",
            "MNT",
            "MOR",
            "MOZ",
            "MMR",
            "NAM",
            "NPL",
            "NED",
            "NCL",
            "NWZ",
            "NIG",
            "NGA",
            "NKR",
            "NOR",
            "OMN",
            "PAK",
            "PLW",
            "PAN",
            "PNG",
            "PAR",
            "PER",
            "PHL",
            "POL",
            "POR",
            "PRI",
            "QAT",
            "MAC",
            "ROM",
            "RUS",
            "RWA",
            "VCT",
            "WSM",
            "SMA",
            "STP",
            "KSA",
            "SEN",
            "SCG",
            "SLE",
            "SGP",
            "SVK",
            "SLO",
            "SOM",
            "RSA",
            "ESP",
            "LKA",
            "SUD",
            "SUR",
            "SWZ",
            "SWE",
            "SUI",
            "SYR",
            "TAJ",
            "TZA",
            "THA",
            "TLS",
            "TOG",
            "TON",
            "TRI",
            "TUN",
            "TUR",
            "TKM",
            "TCA",
            "UGA",
            "UKR",
            "UAE",
            "USA",
            "URU",
            "UZB",
            "VUT",
            "VEN",
            "VNM",
            "YEM",
            "ZAM",
            "ZIM"]
        var i = 0;
        for await (variable of contryCodes) {
            const maPremierePromesse = new Promise(async (resolve, reject) => {
                var options = {
                    'method': 'POST',
                    'url': 'https://fr.soccerwiki.org/download-data.php',
                    'headers': {
                        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="92", "Opera";v="78"',
                        'sec-ch-ua-mobile': '?0',
                        'Upgrade-Insecure-Requests': '1',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.147',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Cookie': 'PHPSESSID=jdvpcmg2j321k5l08lejfs6t4iic2rfj; __cf_bm=92ed1d75476948335c10951430e00a437b3f4fbd-1629964807-1800-ARgA1Ogun6F+FIu/aubyju96nKP3LJoS0qDGlU8xXH+rMEqAW3lQ4Xbmw8LSXahrFYQYXqs0ZCbzFA8eZJAKbrM='
                    },
                    form: {
                        'countryId': contryCodes[i],
                        'format': '1',
                        'options[]': 'PlayerData',
                        'submit': 'Télécharger les données'
                    }
                };
                var nationalite = await nationalitySchema.findOne({ "CountryCodes.iso3": contryCodes[i] })
                if (nationalite != null) {
                    if (nationalite.players != null) {
                        if (nationalite.players.length == 0) {
                            request(options, async function (error, response) {
                                var message
                                if (error) {
                                    if (i > 0) {
                                        i = i - 1;
                                    } else {
                                        i = 0;
                                    }
                                    await new Promise(resolve => setTimeout(resolve, 5000));
                                    message = "retry after 5 sec";
                                    resolve(message)
                                } else {
                                    xml2js.parseString(response.body.replace(/[\n\r]/g, ' ')
                                        .replace(/&/g, "and")
                                        .replace(/-/g, " "), async (err, result) => {

                                            if (err) {
                                                throw err;
                                            }
                                            if (result["PackData"]["PlayerData"][0]["P"] != undefined) {
                                                message = result["PackData"]["PlayerData"][0]["P"].length + ", code" + contryCodes[i]
                                                arrayOfObjectId = {}
                                                var j = 0
                                                await nationalitySchema.findOneAndUpdate({ _id: nationalite._id }, { $unset: { 'players': 1 } })
                                                for await (element of result["PackData"]["PlayerData"][0]["P"]) {
                                                    var _id = element["$"]["id"];
                                                    var numberOfAddedZeros = 12 - _id.length
                                                    var zeroArray = "";
                                                    for (var alpha = 0; alpha < numberOfAddedZeros; alpha++) {
                                                        zeroArray = zeroArray + "0";
                                                    }
                                                    element["$"]["id"] = element["$"]["id"] + zeroArray;
                                                    var x = await playerSchema.findOne({ _id: element["$"]["id"] })
                                                    arrayOfObjectId[j] = x._id
                                                    j++
                                                    if (x.id != null)
                                                        await nationalitySchema.findOneAndUpdate({ _id: nationalite._id }, { $push: { players: x._id } })
                                                }
                                                i++
                                                resolve(message)
                                            } else {
                                                message = contryCodes[i] + " undifined"
                                                i++
                                                resolve(message)
                                            }
                                        });
                                }
                            });
                        } else {
                            message = contryCodes[i] + " already done"
                            i++
                            resolve(message)
                        }
                    } else {
                        message = contryCodes[i] + " don't have any player"
                        i++
                        resolve(message)
                    }
                } else {
                    message = contryCodes[i] + " not found"
                    i++
                    resolve(message)
                }
            });
            await maPremierePromesse.then((value) => {
                console.log(value + ", done");
            });
        }
        res.status(200).json("affecting Players To Contry in progress don't shutdown the server")

    },
    //Clubs
    updateAllClubs: (res) => {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'https://fr.soccerwiki.org/download-data.php',
            'headers': {
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="92", "Opera";v="78"',
                'sec-ch-ua-mobile': '?0',
                'Upgrade-Insecure-Requests': '1',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.147',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Cookie': 'PHPSESSID=jdvpcmg2j321k5l08lejfs6t4iic2rfj; __cf_bm=bc320a08f8dc88e314f71f4cce5de26b256f7337-1629975787-1800-Af8nfxo0RrcQeMB3x3OHDVVhRxuwsAMoJaglaU+KYzBtTYRa9qErA6ErEG5pBwLq8BAxpetdY1njD6Rfha6xIII='
            },
            form: {
                'countryId': '',
                'format': '1',
                'options[]': 'ClubData',
                'submit': 'Télécharger les données'
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            xml2js.parseString(response.body.replace(/[\n\r]/g, ' ')
                .replace(/&/g, "and")
                .replace(/-/g, " "), async (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    result["PackData"]["ClubData"][0]["C"].forEach(async element => {
                        var _id = element["$"]["id"];
                        var numberOfAddedZeros = 12 - _id.length
                        var zeroArray = "";
                        for (var i = 0; i < numberOfAddedZeros; i++) {
                            zeroArray = zeroArray + "0";
                        }
                        element["$"]["id"] = element["$"]["id"] + zeroArray;
                        if (element["$"]["i"] == "") element["$"]["i"] = "Not mentioned"
                        var club = {
                            "_id": element["$"]["id"],
                            "name": element["$"]["n"],
                            "image": element["$"]["i"],
                        }
                        try {
                            await new clubSchema(club).save()
                        } catch (error) {
                            console.log("this club already exist")
                        }
                    });
                    res.status(200).json("Updating clubs in progress don't shutdown the server")
                });
        });
    },
    affectClubssToContry: async (res) => {
        var request = require('request');
        var contryCodes = ["AFG",
            "ALB",
            "ALG",
            "AND",
            "ANG",
            "AIA",
            "ANT",
            "ARG",
            "ARM",
            "ABW",
            "AUS",
            "AUT",
            "AZE",
            "BHS",
            "BHR",
            "BGD",
            "BRB",
            "BLR",
            "BEL",
            "BLZ",
            "BEN",
            "BOL",
            "BIH",
            "BOT",
            "BRA",
            "BRN",
            "BUL",
            "BFA",
            "BDI",
            "KHM",
            "CMR",
            "CAN",
            "CPV",
            "CAR",
            "CHA",
            "CHI",
            "CHN",
            "COL",
            "COM",
            "CON",
            "CRC",
            "CRO",
            "CUB",
            "CYP",
            "CZE",
            "DEN",
            "DJI",
            "DOM",
            "COD",
            "ECU",
            "EGY",
            "ELS",
            "ENG",
            "EQG",
            "ERI",
            "EST",
            "ETH",
            "FRO",
            "FJI",
            "FIN",
            "FRA",
            "PYF",
            "GAB",
            "GAM",
            "GEO",
            "GER",
            "GHA",
            "GIB",
            "GRE",
            "GRN",
            "GUA",
            "GUI",
            "GNB",
            "GUY",
            "HAI",
            "HON",
            "HKG",
            "HUN",
            "ISL",
            "IND",
            "IDN",
            "IRN",
            "IRQ",
            "IRL",
            "ISR",
            "ITA",
            "CIV",
            "JAM",
            "JPN",
            "JOR",
            "KAZ",
            "KEN",
            "KIR",
            "KOR",
            "KWT",
            "KGZ",
            "LAO",
            "LVA",
            "LEB",
            "LBR",
            "LIB",
            "LTU",
            "LUX",
            "MCA",
            "MWI",
            "MYS",
            "MDV",
            "MLI",
            "MLT",
            "MRT",
            "MRI",
            "MEX",
            "MOL",
            "MNG",
            "MNT",
            "MOR",
            "MOZ",
            "MMR",
            "NAM",
            "NPL",
            "NED",
            "NCL",
            "NWZ",
            "NIG",
            "NGA",
            "NKR",
            "NOR",
            "OMN",
            "PAK",
            "PLW",
            "PAN",
            "PNG",
            "PAR",
            "PER",
            "PHL",
            "POL",
            "POR",
            "PRI",
            "QAT",
            "MAC",
            "ROM",
            "RUS",
            "RWA",
            "VCT",
            "WSM",
            "SMA",
            "STP",
            "KSA",
            "SEN",
            "SCG",
            "SLE",
            "SGP",
            "SVK",
            "SLO",
            "SOM",
            "RSA",
            "ESP",
            "LKA",
            "SUD",
            "SUR",
            "SWZ",
            "SWE",
            "SUI",
            "SYR",
            "TAJ",
            "TZA",
            "THA",
            "TLS",
            "TOG",
            "TON",
            "TRI",
            "TUN",
            "TUR",
            "TKM",
            "TCA",
            "UGA",
            "UKR",
            "UAE",
            "USA",
            "URU",
            "UZB",
            "VUT",
            "VEN",
            "VNM",
            "YEM",
            "ZAM",
            "ZIM"]
        var i = 0;
        for await (variable of contryCodes) {
            const maPremierePromesse = new Promise(async (resolve, reject) => {
                var options = {
                    'method': 'POST',
                    'url': 'https://fr.soccerwiki.org/download-data.php',
                    'headers': {
                        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="92", "Opera";v="78"',
                        'sec-ch-ua-mobile': '?0',
                        'Upgrade-Insecure-Requests': '1',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.147',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Cookie': 'PHPSESSID=jdvpcmg2j321k5l08lejfs6t4iic2rfj; __cf_bm=bc320a08f8dc88e314f71f4cce5de26b256f7337-1629975787-1800-Af8nfxo0RrcQeMB3x3OHDVVhRxuwsAMoJaglaU+KYzBtTYRa9qErA6ErEG5pBwLq8BAxpetdY1njD6Rfha6xIII='
                    },
                    form: {
                        'countryId': contryCodes[i],
                        'format': '1',
                        'options[]': 'ClubData',
                        'submit': 'Télécharger les données'
                    }
                };
                var nationalite = await nationalitySchema.findOne({ "CountryCodes.iso3": contryCodes[i] })
                if (nationalite != null) {
                    if (nationalite.clubs != null) {
                        if (nationalite.clubs.length == 0) {
                            request(options, async function (error, response) {
                                var message
                                if (error) {
                                    if (i > 0) {
                                        i = i - 1;
                                    } else {
                                        i = 0;
                                    }
                                    await new Promise(resolve => setTimeout(resolve, 5000));
                                    message = "retry after 5 sec";
                                    resolve(message)
                                } else {
                                    xml2js.parseString(response.body.replace(/[\n\r]/g, ' ')
                                        .replace(/&/g, "and")
                                        .replace(/-/g, " "), async (err, result) => {

                                            if (err) {
                                                throw err;
                                            }
                                            if (result["PackData"]["ClubData"][0]["C"] != undefined) {
                                                message = result["PackData"]["ClubData"][0]["C"].length + ", code" + contryCodes[i]
                                                arrayOfObjectId = {}
                                                var j = 0
                                                await nationalitySchema.findOneAndUpdate({ _id: nationalite._id }, { $unset: { 'clubs': 1 } })
                                                for await (element of result["PackData"]["ClubData"][0]["C"]) {
                                                    var _id = element["$"]["id"];
                                                    var numberOfAddedZeros = 12 - _id.length
                                                    var zeroArray = "";
                                                    for (var alpha = 0; alpha < numberOfAddedZeros; alpha++) {
                                                        zeroArray = zeroArray + "0";
                                                    }
                                                    element["$"]["id"] = element["$"]["id"] + zeroArray;
                                                    var x = await clubSchema.findOne({ _id: element["$"]["id"] })
                                                    arrayOfObjectId[j] = x._id
                                                    j++
                                                    if (x._id != null)
                                                        await nationalitySchema.findOneAndUpdate({ _id: nationalite._id }, { $push: { clubs: x._id } })
                                                }
                                                i++
                                                resolve(message)
                                            } else {
                                                message = contryCodes[i] + " undifined"
                                                i++
                                                resolve(message)
                                            }
                                        });
                                }
                            });
                        } else {
                            message = contryCodes[i] + " already done"
                            i++
                            resolve(message)
                        }
                    } else {
                        message = contryCodes[i] + " don't have any clubs"
                        i++
                        resolve(message)
                    }
                } else {
                    message = contryCodes[i] + " not found"
                    i++
                    resolve(message)
                }
            });
            await maPremierePromesse.then((value) => {
                console.log(value + ", done");
            });
        }
        res.status(200).json("affecting clubs To Contry in progress don't shutdown the server")

    },

    //GET ALL
    getAllCountries: async (req, res, next) => {

        let limit = Number(req.params.limit);
        let like = req.params.like;

        if(like === '0'){
            nationalitySchema.find({}).limit(limit).then(response => {
                return res.status(200).json({
                    message: "all countries",
                    count: response.length,
                    countries: response,
                })
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            })
        }else{
            nationalitySchema.find({ Name: { $regex: ".*" + like + ".*", $options: 'i'} }).limit(limit).then(response => {
                return res.status(200).json({
                    message: "all countries",
                    count: response.length,
                    countries: response,
                })
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            })
        }
        



    },
    getAllPlayers: async (req, res, next) => {
        let limit = Number(req.params.limit);
        let like = req.params.like;
        let country = req.params.country;

        if (country === '0') {
            if (like === '0') {
                playerSchema.find({}).limit(limit).then(response => {
                    return res.status(200).json({
                        message: "all players",
                        count: response.length,
                        players: response,
                    })
                }).catch(err => {
                    res.status(404).json({
                        error: err
                    })
                })
                //$or [ {firstName: { $regex: ".*" + like + ".*", $options: 'i' }} , {lastName: { $regex: ".*" + like + ".*", $options: 'i' }} ] 
            } else {
                

                  /*aggregate({
                    $or: [
                        { firstName: { $regex: ".*" + like + ".*", $options: 'i'} },
                        { lastName: { $regex: ".*" + like + ".*", $options: 'i' } },
                    ]
                })*/

                playerSchema.aggregate([
                    {
                      $addFields: {
                        fullName: {
                          $concat: ["$firstName", " ", "$lastName"],
                        },
                  
                      },
                    },
                    {
                      $match: {
                        fullName: {
                          $regex: ".*" + like + ".*",
                          $options: "i",
                        },
                   
                      },
                    },
                  ]).limit(limit).then(response => {
                    return res.status(200).json({
                        message: "all players",
                        count: response.length,
                        players: response,
                    })
                }).catch(err => {
                    res.status(404).json({
                        error: err
                    })
                })
            }
        } else {
            nationalitySchema.findOne({ Name: { $regex: "^" + country + "$", $options: 'i' } }).populate({
                path: 'players',
                model: 'player'
            }).then(response => {
                return res.status(200).json({
                    message: "all players",
                    count: response.players.length,
                    players: response.players,
                })
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            })

        }
    },
    getAllClubs: async (req, res, next) => {
        let limit = Number(req.params.limit);
        let like = req.params.like;
        let country = req.params.country;

        if (country === '0') {
            if (like === '0') {
                clubSchema.find({}).limit(limit).then(response => {
                    return res.status(200).json({
                        message: "all clubs",
                        count: response.length,
                        clubs: response,
                    })
                }).catch(err => {
                    res.status(404).json({
                        error: err
                    })
                })
            } else {
                clubSchema.find({ name: { $regex: ".*" + like + ".*", $options: 'i' } }).limit(limit).then(response => {
                    return res.status(200).json({
                        message: "all clubs",
                        count: response.length,
                        clubs: response,
                    })
                }).catch(err => {
                    res.status(404).json({
                        error: err
                    })
                })
            }
        } else {
            nationalitySchema.findOne({ Name: { $regex: "^" + country + "$", $options: 'i' } }).populate({
                path: 'clubs',
                model: 'club'
            }).then(response => {
                return res.status(200).json({
                    message: "all clubs",
                    count: response.clubs.length,
                    clubs: response.clubs,
                })
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            })

        }
    },

}
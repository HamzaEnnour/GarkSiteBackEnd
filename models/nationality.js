const mongoose = require('mongoose')
const Schema = mongoose.Schema

var nationality = Schema({
        Name: {
            type: String
        },
        players: {
            type:Schema.Types.ObjectId,
            ref:"player",
            "default": []
        },
        clubs: {
            type:Schema.Types.ObjectId,
            ref:"club",
            "default": []
        },
        Capital: {
            DLST: {
                type: String
            },
            TD: {
                type: Number
            },
            Flg: {
                type: Number
            },
            Name: {
                type: String
            },
            GeoPt: {
                type: [
                    Number
                ]
            }
        },
        GeoRectangle: {
            West: {
                type: Number
            },
            East: {
                type: Number
            },
            North: {
                type: Number
            },
            South: {
                type: Number
            }
        },
        SeqID: {
            type: Number
        },
        GeoPt: {
            type: [
                Number
            ]
        },
        TelPref: {
            type: Date
        },
        CountryCodes: {
            tld: {
                type: String
            },
            iso3: {
                type: String
            },
            iso2: {
                type: String
            },
            fips: {
                type: String
            },
            isoN: {
                type: Number
            }
        },
        CountryInfo: {
            type: String
        }
    })

module.exports = mongoose.model('nationality', nationality, 'nationality')
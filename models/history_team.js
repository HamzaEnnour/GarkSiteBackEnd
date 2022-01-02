const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var history_team = Schema({
  team: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "team",
  },
  // join , leave , creation
  action: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "skills",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String
  },
});

module.exports = mongoose.model("history_team", history_team, "history_team");

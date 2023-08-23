const mongoose = require('mongoose');

// schema
const cleanZoneSchema = new mongoose.Schema({
  name: String,
  order: Number,
  positions: [Number],
  cleaningRound: Number,
  cleaningDuration: String,
  cleaningPreset: Object, //json
}, {
  versionKey: false,
});

const CleanZone = mongoose.model('CleanZone', cleanZoneSchema);
module.exports = CleanZone;
const mongoose = require('mongoose');

// schema
const noGoZoneSchema = new mongoose.Schema({
  positions: [Number],
}, {
  versionKey: false,
});

const NoGoZone = mongoose.model('NoGoZone', noGoZoneSchema);
module.exports = NoGoZone;
const mongoose = require('mongoose');

// schema
const noCleanZoneSchema = new mongoose.Schema({
  positions: [Number],
}, {
  versionKey: false,
});

const NoCleanZone = mongoose.model('NoCleanZone', noCleanZoneSchema);
module.exports = NoCleanZone;
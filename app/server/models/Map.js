const mongoose = require('mongoose');
const CleanZone = require('./CleanZone');
const NoGoZone = require('./NoGoZone');
const NoCleanZone = require('./NoCleanZone');
const fs = require('fs')
const logger = require('../logger');

// schema
const mapSchema = new mongoose.Schema({
  name: String,
  startingPoint: [{ 
    type: Number, 
    required: true
  }],
  path: String,
  cleanZones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CleanZone'}],
  noGoZones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NoGoZone'}],
  noCleanZones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NoCleanZone'}],
}, {
  versionKey: false,
});

// cascade delete

// cascade delete
mapSchema.pre('deleteMany', { document: false, query:true }, async function(next){
  const data = await Map.find(this._conditions).lean();

  // iterate each map data
  for (let i = 0 ; i < data.length; i++){
    const row = data[i];
    const fullpath = row.path + '/' + row.name;
    
    // delete image
    await fs.unlink(fullpath, (err) =>{
      // Error will occur in current data structure if multiple maps point to same image file
      logger.error(err)
    });
  
    const cfids = row.cleanZones;
    await CleanZone.deleteMany({
      _id: {$in: cfids},
    })
  
    const ngids = row.noGoZones;
    await NoGoZone.deleteMany({
      _id: {$in: ngids},
    })
  
    const nczids = row.noCleanZones;
    await NoCleanZone.deleteMany({
      _id: {$in: nczids},
    })
  }
  next();
});

const Map = mongoose.model('Map', mapSchema);
module.exports = Map;
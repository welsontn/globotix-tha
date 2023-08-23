const mongoose = require('mongoose');
const CleaningPlan = require('../../models/CleaningPlan');
const CleaningFavorite = require('../../models/CleaningFavorite');
const Map = require('../../models/Map');
const CleanZone = require('../../models/CleanZone');
const NoGoZone = require('../../models/NoGoZone');
const NoCleanZone = require('../../models/NoCleanZone');

const addPlan = async (req, res) => {
  var data = JSON.parse(req.body.json);
  const filename = req.file.filename;
  const filedest = req.file.destination;

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // init
    var cleaningFavorites = [];

    // iterate favorites
    var cleaning_favorites = data.cleaning_favorites;
    for (const favorite of cleaning_favorites){
      var favorite_data = favorite;

      // init
      var cleanZones = [];
      var noGoZones = [];
      var noCleanZones = [];

      // CleanZone
      for (const row_data of favorite_data.map.cleanZones){
        // can be optimized using insertMany
        const row = new CleanZone({
          name: row_data.name,
          positions: row_data.positions,
          order: row_data.order,
          cleaningRound: row_data.cleaningRound,
          cleaningDuration: row_data.cleaningDuration,
          cleaningPreset: JSON.stringify(row_data.cleaningPreset),
        })
        await row.save();
        cleanZones.push(row.id);
      }
  
      // No Go Zone
      for (const row_data of favorite_data.map.noGoZones){
        const row = new NoGoZone({
          positions: row_data.positions
        })
        await row.save();
        noGoZones.push(row.id);
      }
  
      // No Clean Zone
      for (const row_data of favorite_data.map.noCleanZones){
        const row = new NoCleanZone({
          positions: row_data.positions
        })
        await row.save();
        noCleanZones.push(row.id);
      };

      // Map
      const mapData = favorite_data.map
      const map = new Map({
        name: filename,
        path: filedest,
        startingPoint: mapData.startingPoint,
        cleanZones: [...cleanZones],
        noGoZones: [...noGoZones],
        noCleanZones: [...noCleanZones],
      })
      await map.save();

      // cleaning favorite
      const cleaningFavorite = new CleaningFavorite({
        name: favorite_data.name,
        default: favorite_data.default,
        map: map.id,
      })
      await cleaningFavorite.save();
      cleaningFavorites.push(cleaningFavorite.id)
    };

    // cleaning plan
    const cleaningPlan = new CleaningPlan({
      name: favorite_data.name,
      cleaning_favorites: [...cleaningFavorites],
    })
    await cleaningPlan.save();
    
    // commit transaction
    session.commitTransaction();
    session.endSession();
  } catch (err){
    session.abortTransaction();
    session.endSession();
    return res.sendStatus(422);
  }

  return res.sendStatus(200);
};

module.exports = addPlan;
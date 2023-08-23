const mongoose = require('mongoose');
const Map = require('./Map');

// schema
const cleaningFavoriteSchema = new mongoose.Schema({
  name: String,
  default: Boolean,
  map: { type: mongoose.Schema.Types.ObjectId, ref: 'Map'},
}, {
  versionKey: false,
});

// cascade delete
cleaningFavoriteSchema.pre('deleteMany', { document: false, query:true }, async function(next){
  const data = await CleaningFavorite.find(this._conditions).lean();
  const ids = data.map(x => x.map);
  await Map.deleteMany({
    _id: {$in: ids},
  })
  next();
});

const CleaningFavorite = mongoose.model('CleaningFavorite', cleaningFavoriteSchema);
module.exports = CleaningFavorite;
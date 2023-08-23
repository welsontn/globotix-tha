const mongoose = require('mongoose');
const CleaningFavorite = require('./CleaningFavorite');

// schema
const cleaningPlanSchema = new mongoose.Schema({
  name: String,
  cleaning_favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CleaningFavorite'}],
}, {
  versionKey: false,
});

// cascade delete
cleaningPlanSchema.pre('deleteOne', { document: true, query:false }, async function(next){
  const ids = this.cleaning_favorites;
  await CleaningFavorite.deleteMany({
    _id: {$in: ids},
  })
  next();
});

const CleaningPlan = mongoose.model('CleaningPlan', cleaningPlanSchema);
module.exports = CleaningPlan;
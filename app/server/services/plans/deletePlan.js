const mongoose = require('mongoose');
const CleaningPlan = require('../../models/CleaningPlan');
const CleaningFavorite = require('../../models/CleaningFavorite');
const Map = require('../../models/Map');
const CleanZone = require('../../models/CleanZone');
const NoGoZone = require('../../models/NoGoZone');
const NoCleanZone = require('../../models/NoCleanZone');

const deletePlan = async (req, res) => {
  const planId = req.params.planId;

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // delete cleaning plan
    // const result = await CleaningPlan.findOneAndRemove({ _id: planId });
    const doc = await CleaningPlan.findOne({_id:planId});
    if (doc){
      await doc.deleteOne();
    } else {
        throw("Invalid plan ID");
    }

    // if (result.deletedCount == 0){
    //   throw("Invalid plan ID");
    // }
    
    // commit transaction
    session.commitTransaction();
    session.endSession();
  } catch (err){
    session.abortTransaction();
    session.endSession();
    return res.sendStatus(400);
  }

  return res.sendStatus(200);
};

module.exports = deletePlan;
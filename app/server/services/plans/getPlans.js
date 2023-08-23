const mongoose = require('mongoose');
const CleaningPlan = require('../../models/CleaningPlan');
const CleaningFavorite = require('../../models/CleaningFavorite');
const Map = require('../../models/Map');
const CleanZone = require('../../models/CleanZone');
const NoGoZone = require('../../models/NoGoZone');
const NoCleanZone = require('../../models/NoCleanZone');

const getPlans = async (req, res) => {
  var result = [];

  // fetch plan
  result = await CleaningPlan.find()
                            .populate({
                              path: 'cleaning_favorites',
                              populate: {
                                path: 'map',
                                populate: {
                                  path: 'cleanZones noGoZones noCleanZones',
                                  options: { sort: { 'order': 1 }},
                                }
                              }
                            })

  return res.status(200).json(result);
};

module.exports = getPlans;
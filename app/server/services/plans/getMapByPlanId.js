const CleaningPlan = require('../../models/CleaningPlan');
const fs = require('fs').promises;

const getMapByPlanId = async (req, res) => {
  const planId = req.params.planId;

  const plan = await CleaningPlan.findOne({_id: planId})
                                  .populate({
                                    path: 'cleaning_favorites',
                                    populate: {
                                      path: 'map',
                                    }
                                  })

  var maps = [];
  for (let i = 0; i < plan.cleaning_favorites.length; i++){
    const row = plan.cleaning_favorites[i]
    const map = row.map
    const filepath = map.path + '/' + map.name; 
    const contents = await fs.readFile(filepath, {encoding: 'base64'});
    const mapObject = map.toObject(); // convert to object so that can append mapData
    mapObject.mapData = contents; // Think better to just use URL fetch whenever possible since base64 increase size by 33%
    maps.push(mapObject);
  }

  return res.status(200).json(maps);
};

module.exports = getMapByPlanId;
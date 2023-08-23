const CleaningPlan = require('../../models/CleaningPlan');
const fs = require('fs').promises;
const config = require('../../config')

const addPlanCommand = async (req, res) => {
  const planId = req.params.planId;

  const plan = await CleaningPlan.findOne({_id: planId})
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
  
  
  // create dir
  const dirpath = config.LOG_UPLOAD_PATH;
  await fs.mkdir(dirpath, { recursive: true })

  // create file log based on date
  const fullpath = dirpath + '/' + Date.now() + '.txt';

  // open file
  const filelog = await fs.open(fullpath, 'a');

  // start writing log
  await filelog.write("LocationName=" + plan.name + '\n');
  let cleaningData = []; //cleaning preset 
  let cz_order = ""; //clean zone order
  let sz_order = ""; //skipped zone order

  // favorites
  for (let i = 0; i < plan.cleaning_favorites.length; i++){
    const favorite = plan.cleaning_favorites[i];
    
    // clean zones
    for (let j = 0; j < favorite.map.cleanZones.length; j++){
      const cz = favorite.map.cleanZones[j];

      // Add cleaning preset parameter
      let preset = JSON.parse(cz.cleaningPreset);
      preset["name"] = cz.name;
      cleaningData.push(preset);
      
      // Cleaning zone order and skipped zone
      if (cz.order > 0){
        if (cz_order.length > 0){
          cz_order += ","; //Things to consider: Cleaning Zone having , character
        }
        cz_order += cz.name;
      } else {
        if (sz_order.length > 0){
          sz_order += ","; //Things to consider: Cleaning Zone having , character
        }
        sz_order += cz.name;
      }
    }
  }
  await filelog.write("CleanedZone=" + cz_order + "\n");
  await filelog.write("SkippedZones=" + cz_order + "\n");
  await filelog.write("CleaningPreset=" + "\n");
  for (let i = 0; i < cleaningData.length; i++){
    const row = cleaningData[i]; // cleaning preset is in JSON format
    await filelog.write(row["name"] + "\n");
    for (const key in row){
      let val = JSON.stringify(row[key]);
      if (key != "name"){
        await filelog.write(key + "=" + val + "\n");
      }
    }
  }

  await filelog.write("StartTime=" + Date.now() + "\n"); // record to unix timestamp
  
  // close file
  await filelog.close();

  return res.sendStatus(200);
};

module.exports = addPlanCommand;
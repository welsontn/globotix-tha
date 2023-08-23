
const express = require('express');
const routes = express.Router();

const multer  = require('multer')

const planController = require('../controllers/PlanController');

// multer storage configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'home/images/maps')
    },
    filename: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const result = filetypes.test(file.mimetype);
      if (result){
        // use hash over date better 
        cb(null, Date.now() + file.originalname)
      } else {
        cb(null, false);
      }
    }
  })
var upload = multer({storage: storage});

routes.get("/plans", planController.getPlans);
routes.post("/plans", upload.single('file'), planController.addPlan); //support one file upload only and not multiple
routes.put("/plans", planController.updatePlan);

routes.delete("/plans/:planId", planController.deletePlanById);

routes.get("/plans/:planId/map", planController.getMapByPlanId);

routes.put("/plans/:planId/clean_zones", planController.updateZoneByZoneId);
routes.put("/plans/:planId/no_go_zones", planController.updateNoGoZoneByZoneId);
routes.put("/plans/:planId/no_clean_zones", planController.updateNoCleanZoneByZoneId);

routes.put("/plans/:planId/favorites", planController.getFavoritesByPlanId);

routes.post("/plans/:planId/command", planController.addPlanCommand);

module.exports = routes
const Service = require('../services/plans/PlanService');

const addPlan = async (request, response) => {
  return await Service.addPlan(request, response);
};

const addPlanCommand = async (request, response) => {
  return await Service.addPlanCommand(request, response);
};

const deletePlanById = async (request, response) => {
  return await Service.deletePlan(request, response);
};

const getFavoritesByPlanId = async (request, response) => {
  return response.sendStatus(501);
};

const getMapByPlanId = async (request, response) => {
  return await Service.getMapByPlanId(request, response);
};

const getPlans = async (request, response) => {
  return await Service.getPlans(request, response);
};

const updateNoCleanZoneByZoneId = async (request, response) => {
  return response.sendStatus(501);
};

const updateNoGoZoneByZoneId = async (request, response) => {
  return response.sendStatus(501);
};

const updatePlan = async (request, response) => {
  return response.sendStatus(501);
};

const updateZoneByZoneId = async (request, response) => {
  return response.sendStatus(501);
};


module.exports = {
  addPlan,
  addPlanCommand,
  deletePlanById,
  getFavoritesByPlanId,
  getMapByPlanId,
  getPlans,
  updateNoCleanZoneByZoneId,
  updateNoGoZoneByZoneId,
  updatePlan,
  updateZoneByZoneId,
};

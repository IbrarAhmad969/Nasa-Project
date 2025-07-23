const { getAllPlanets } = require("../../models/planets.model");


function httpGetAllPlanetsHandler(req, res) {
  
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanetsHandler,
};
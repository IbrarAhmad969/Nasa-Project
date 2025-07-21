const { getAllPlanets } = require("../../models/planets.model");

console.log("Planets controllers: ", getAllPlanets);


function getAllPlanetsHandler(req, res) {
  const planets = getAllPlanets();
  return res.status(200).json(planets);
}

module.exports = {
  getAllPlanets: getAllPlanetsHandler,
};
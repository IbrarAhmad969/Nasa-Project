const express = require('express');

const {httpGetAllPlanetsHandler} = require("../planets/planets.controller");

const planetsRouter = express.Router();
planetsRouter.get('/', httpGetAllPlanetsHandler);

module.exports = planetsRouter;


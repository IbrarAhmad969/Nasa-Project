const express = require('express');
const planetsRouter = require("../routes/planets/planets.router")
const launchesRouter = require('../routes/launches/launches.router');

const api = express.Router(); // This setup is used for future versioning.

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;

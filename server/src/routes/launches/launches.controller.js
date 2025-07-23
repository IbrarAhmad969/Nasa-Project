
const {launches} = require('../../models/launches.model');


function getAllLaunches(req, res){ // Change the data to array. manipulate the data as we want 
    return res.status(200).json(Array.from(launches.values()));
}

module.exports = {
    getAllLaunches,
}
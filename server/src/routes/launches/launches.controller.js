
const {getAllLaunches} = require('../../models/launches.model');


function httpGetAllLaunches(req, res){ // Change the data to array. manipulate the data as we want 
    return res.status(200).json(getAllLaunches());
}

module.exports = {
    httpGetAllLaunches,
}

const {getAllLaunches, addNewLaunch} = require('../../models/launches.model');


function httpGetAllLaunches(req, res){ // Change the data to array. manipulate the data as we want 
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res){
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination){
        return res.status(400).json({
            error: "Mission required Launch Property",

        })
    }

    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: "Invalid Date",
        })
    }

    addNewLaunch(launch);
    return res.status(201).json(launch);
}



module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
}
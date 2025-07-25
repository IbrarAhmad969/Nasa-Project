
const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model');


function httpGetAllLaunches(req, res){ // Change the data to array. manipulate the data as we want 
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res){
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
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
function httpAbortLaunch(req, res){
    const launchId = +req.params.id;

    //if launch doesn't exist 
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: "Launch not found! ",
        })
    }

    //if Launch does exist 
    const aborted = abortLaunchById(launchId)
    return res.status(200).json(aborted);
}



module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
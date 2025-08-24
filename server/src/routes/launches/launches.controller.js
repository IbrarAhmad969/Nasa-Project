
const {getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model');


async function httpGetAllLaunches(req, res){ // Change the data to array. manipulate the data as we want 
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res){
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

    await scheduleNewLaunch(launch);
    
    return res.status(201).json(launch);
}
async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    console.log(`${req.url }`)

    
    //if launch doesn't exist 
    const existLaunch = await existsLaunchWithId(launchId);
    if (!existLaunch) {
        return res.status(404).json({
            error: "Launch not found! ",
        })
    }

    //if Launch does exist 
    const aborted = await abortLaunchById(launchId);

    if(!aborted){
        return res.status(400).json({
            error: "Launch not Aborted"
        })
    }
    
    return res.status(200).json({
        ok: true,
    });
}



module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
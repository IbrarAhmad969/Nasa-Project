const launchesDataBase = require("./launches.mongo");


let latestFlightNumber = 100;


const launch = {
    flightNumber: 100,
    missionName: 'Kepler Exploration X',
    rocket: 'Explorer ISI',
    launchDate: new Date('Dec 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,

};

saveLaunch(launch);

async function saveLaunch(launch){
    await launchesDataBase.updateOne({ 
        flightNumber: launch.flightNumber // if the flight no exists, then ignore, if not create
    }, launch, { // launch 
        upsert: true
    })
}

function existsLaunchWithId(launchId){
    return launchesDataBase.has(launchId);

}

async function getAllLaunches(){
    return await launchesDataBase
    .find({}, {'_id': 0, '__v': 0})
}

function addNewLaunch(launch){

    latestFlightNumber++;
    launchesDataBase.set(latestFlightNumber, Object.assign(launch, {

        upcoming: true,
        success: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: latestFlightNumber,
    }));

}
function abortLaunchById(launchId){
    const aborted = launchesDataBase.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;

}
module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    abortLaunchById,

}
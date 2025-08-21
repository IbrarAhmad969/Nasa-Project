const launchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");


const DEFAULT_FLIGHT_NUMBER = 100;

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


async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    }); // Return JS object only. 

    if (!planet) {
        throw new Error("No Target is Found! ");
    }

    await launchesDataBase.updateOne({
        flightNumber: launch.flightNumber // if the flight num exists, then ignore, if not create
    }, launch, { // launch 
        upsert: true
    })
}


function existsLaunchWithId(launchId) {
    return launchesDataBase.has(launchId);

}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDataBase.findOne( // find the higher value. by sorting 
    ).sort( // Criteria for Sorting. in Desc order. 
        '-flightNumber'
    );

    

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    } // if no data is there. so what it will be? 

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDataBase
        .find({}, { '_id': 0, '__v': 0 })
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {

//     latestFlightNumber++;
//     launchesDataBase.set(latestFlightNumber, Object.assign(launch, {

//         upcoming: true,
//         success: true,
//         customers: ['Zero to Mastery', 'NASA'],
//         flightNumber: latestFlightNumber,
//     }));

// }
function abortLaunchById(launchId) {
    const aborted = launchesDataBase.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;

}


module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
   // addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    abortLaunchById,

}
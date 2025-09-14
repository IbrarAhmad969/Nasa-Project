const launchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios")


const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100, // flight number from API
    missionName: 'Kepler Exploration X', // name from API, launch response 
    rocket: 'Explorer ISI', // Rocket.name
    launchDate: new Date('Dec 27, 2030'), // date local 
    target: 'Kepler-442 b', // 
    customer: ['ZTM', 'NASA'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true, // success 

};

saveLaunch(launch);

const SPACE_X_API_URL = "https://api.spacexdata.com/v5/launches/latest";
async function loadLaunchesData() {
    console.log("Downloading launches data...");
    await axios.post(SPACE_X_API_URL, {
        query: {},
        options: {
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payload',
                    select: {
                        'customer': 1
                    }
                }
            ]
        }
    });
}


async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    }); // Return JS object only. 

    if (!planet) {
        throw new Error("No Target is Found! ");
    }

    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber // if the flight num exists, then ignore, if not create
    }, launch, { // launch 
        upsert: true
    })
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

async function existsLaunchWithId(launchId) {
    return await launchesDataBase.findOne({
        flightNumber: launchId
    });

}

async function abortLaunchById(launchId) {
    const aborted = await launchesDataBase.updateOne(
        { flightNumber: launchId },
        { $set: { upcoming: false, success: false } }
    );

    // return true if one document was actually modified
    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}


module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchesData,

}
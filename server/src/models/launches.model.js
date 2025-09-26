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
    customers: ['ZTM', 'NASA'],
    upcoming: true, // upcoming
    success: true, // success 

};

saveLaunch(launch);

const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
    console.log("Downloading launches data...");

    const response = await axios.post(SPACE_X_API_URL, {

        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if (response !== 200) {
        console.log("problem downloading launch data")
        throw new Error("Launch Data Download failed!");
    }


    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customer'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber}`)
        await saveLaunch(launch);

    }
}


async function loadLaunchesData() {


    // reducing load, by this query, if first launch already exists. 

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: 'FalconSat',

    })

    if (firstLaunch) {
        console.log("launch Data is already loaded! ");
    } else {
        await populateLaunches();
    }
}


async function saveLaunch(launch) {

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
        .skip(20)
        .limit(50)
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    }); // Return JS object only. 

    if (!planet) {
        throw new Error("No Target is Found! ");
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch);
}

// turn on Pagination will overload server, now reduce the load by writing a function. 

async function findLaunch(filter) {
    return await launchesDataBase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
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
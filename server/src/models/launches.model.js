const launches = new Map();

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

launches.set(launch.flightNumber, launch)

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){

    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {

        upcoming: true,
        success: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: latestFlightNumber,
    }));

}

module.exports = {
    getAllLaunches,
    addNewLaunch,
}
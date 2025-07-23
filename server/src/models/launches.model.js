const launches = new Map();


const launch = {
    flightNumber: 100,
    missionName: 'Kepler Exploration X',
    rocket: 'Explorer ISI',
    launchData: new Date('Dec 27, 2030'),
    destination: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,

};

launches.set(launch.flightNumber, launch)

function getAllLaunches(){
    return Array.from(launches.values());
}

module.exports = {
    getAllLaunches,
}
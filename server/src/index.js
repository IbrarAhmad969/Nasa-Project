const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const {loadLaunchesData} = require("./models/launches.model");


async function loadServer() {
    try {
        await mongoConnect();
        await loadPlanetsData();
        await loadLaunchesData();
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

loadServer();
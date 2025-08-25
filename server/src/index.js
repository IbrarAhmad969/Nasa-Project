const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");


async function loadServer() {
    try {
        await mongoConnect();
        await loadPlanetsData();
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

loadServer();
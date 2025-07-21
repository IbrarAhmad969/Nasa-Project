const PORT = process.env.PORT || 8000
const app = require('./app');
const http = require('http');
const { loadPlanetsData } = require("./models/planets.model")


const server = http.createServer(app)

async function loadServer() {
    await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT}`);
    });
}

loadServer();
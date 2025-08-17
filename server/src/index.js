const PORT = process.env.PORT || 8000
const app = require('./app');
const http = require('http');
const { loadPlanetsData } = require("./models/planets.model")
const mongoose = require("mongoose")

const server = http.createServer(app)

async function loadServer() {
    try {
        await mongoose.connect('mongodb+srv://ibrarhashmi206:w2EZXI6n7TAK17W1@cluster0.nmb1i9g.mongodb.net/NasaProject');
        console.log("Connected Successfully");
        await loadPlanetsData()
        server.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`);
        });


    } catch (error) {
        console.error('Error While connecting the DB ', error.message)
        process.exit(1);
    }

}

loadServer();
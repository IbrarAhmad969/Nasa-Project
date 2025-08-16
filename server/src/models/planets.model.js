const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // insert + update = upsert -> so that doc is not created again and again as we restart server. 
          savePlanet(data)
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const counterPlanetFound = (await getAllPlanets()).length;

        console.log(`${counterPlanetFound} Habitable planets found! `);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({ // if exist do this. 
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name, // if doesn't exist do this. 
    }, {
      upsert: true,
    });
  } catch (error) {
    console.err(`Couldn't save to planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const port = 3000;
const rover_endpoint = "https://api.nasa.gov/mars-photos/api/v1";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get("/getRoverName/:rover_name", async (req, res) => {
  let rover = await fetch(`
            ${rover_endpoint}/manifests/${req.params.rover_name}?api_key=${process.env.API_KEY}
        `).then((res) => res.json());
  res.send(rover);
});

app.get("/getRoverCamerasAndPhotosInfo/:rover_name", async (req, res) => {
  const { rover_name } = req.params;
  let rover_photos = await fetch(
    `${rover_endpoint}/rovers/${rover_name}/latest_photos?api_key=${process.env.API_KEY}
        `
  ).then((res) => res.json());
  res.send(rover_photos);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

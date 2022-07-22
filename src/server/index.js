require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;
const marsPhotosApi = "https://api.nasa.gov/mars-photos/api/v1/rovers";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// get rover name
app.get("/getRoverName", async (req, res) => {
  try {
    let rover = await fetch(
      `${marsPhotosApi}api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    console.log(rover);
    //res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});
// get rovers photos info
app.get("/getRoverCamerasAndPhotosInfo", async (req, res) => {
  try {
    let response = await fetch(
      `${marsPhotosApi}/manifests/${req}api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    console.log(response);
  } catch (err) {
    console.log("error:", err);
  }
});
// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

import { set } from "immutable";
import "./assets/stylesheets/resets.css";
import "./assets/stylesheets/index.css";
import img from "./assets/images/mars.jpg";

let store = {
  user: { name: "Student" },
  apod: "",
  roverNames: ["Curiosity", "Opportunity", "Spirit"],
  rovers: {},
  selectedRover: "Curiosity",
  photos: {},
};

// add our markup to the page
const root = document.getElementById("root");

function onSelectTab(selectedTab) {
  updateStore(store, { selectedRover: selectedTab });
}
window.onSelectTab = onSelectTab;

const formatDate = (date) => {
  const dateArr = date.split("-");
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];
  return `${year}-${month}-${day}`;
};

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, roverNames, selectedRover, photos } = state;

  return `
        <header>
            <div class="banner">
            <img class="banner-img" src=${img}>
            <h1 class="banner-text">Photo of day</h1>
            </div>
            ${Nav(roverNames, selectedRover)}
        </header>
        <main>
            ${RoverData(rovers, selectedRover, photos)}
        </main>
        <footer>
            <h6>
                This page was made possible by the <a href="https://learn.udacity.com/">udacity</a> who provided the knowledge to create this page.
            </h6>
        </footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
const Tab = (name, selectedRover) => {
  const className = name === selectedRover ? "active" : "inactive";

  return `
        <div class="nav-tab ${className}">
            <a href="#" id="${name}" class="nav-link" onclick="onSelectTab(id)">${name}</a> 
        </div>
    `;
};

const Nav = (roverNames, selectedRover) => {
  return `
            <nav class="nav-container">
                ${roverNames
                  .map((name) => {
                    return `
                        ${Tab(name, selectedRover)}
                    `;
                  })
                  .join("")}
            </nav>
        `;
};

const RoverPhotos = (roverName, max_date, photos) => {
  const rover = Object.keys(photos).find((key) => key === roverName);

  if (!rover) {
    getRoverCamerasAndPhotosInfo(roverName);
  }

  const roverPhotos = store.photos[roverName];

  return `
            <section>
                <p>Check ${roverName}'s photos. Photos where taken on ${formatDate(
    max_date
  )}.</p>
                <div class="photos">
                    ${roverPhotos
                      .map(
                        (photo) =>
                          `<img class="rover-img" src=${photo.img_src} width=300px/>`
                      )
                      .join("")}
                </div>
            </section>
        `;
};
const RoverData = (rovers, selectedRover, photos) => {
  const rover = Object.keys(rovers).find((key) => key === selectedRover);

  if (!rover) {
    getRoverName(selectedRover);
  }

  const roverToDisplay = rovers[selectedRover];

  if (roverToDisplay) {
    return `
                <section>
                    <p><b>Launched:</b> ${formatDate(
                      roverToDisplay.launch_date
                    )}</p>
                    <p><b>Landed:</b> ${formatDate(
                      roverToDisplay.landing_date
                    )}</p>
                    <p><b>Status:</b> ${roverToDisplay.status.toUpperCase()}</p>
                </section>
                    
                ${RoverPhotos(
                  roverToDisplay.name,
                  roverToDisplay.max_date,
                  photos
                )}
            `;
  }
  return `<div> Loading Data... </div>`;
};

// ------------------------------------------------------  API CALLS

const getRoverName = (roverName) => {
  fetch(`http://localhost:3000/getRoverName/${roverName}`)
    .then((res) => res.json())
    .then(({ photo_manifest }) =>
      updateStore(store, {
        rovers: set(store.rovers, roverName, {
          ...store.rovers[roverName],
          ...photo_manifest,
        }),
      })
    );
};

const getRoverCamerasAndPhotosInfo = (roverName) => {
  fetch(`http://localhost:3000/getRoverCamerasAndPhotosInfo/${roverName}`)
    .then((res) => res.json())
    .then(({ latest_photos }) => {
      updateStore(store, {
        photos: {
          ...store.photos,
          [roverName]: [...latest_photos],
        },
      });
    });
};

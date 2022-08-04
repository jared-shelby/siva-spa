// JS#1 :: "index.js" 
// => sitewide constants & functions

// --------- SITEWIDE CONSTANTS ---------
const URL = "http://localhost:3000"; // root url for api
const userId = 1; // user id of logged in user
const home = document.getElementById("home"); // home button in navbar
const milestones = document.getElementById("milestones"); // milestones button in navbar
const spending = document.getElementById("spending"); // spending button in navbar
const settings = document.getElementById("settings"); // settings button in navbar
const logobar = document.getElementById("logobar"); // left sidebar container for logos
const main = document.getElementById("main"); // middle container for content
const sidebar = document.getElementById("sidebar"); // right sidebar container for charts and forms
// ---------------------------------------

// --------- SITEWIDE FUNCTIONS ---------
// clear the html when navigating to new tab
function sanitize() {
    logobar.innerHTML = "";
    main.innerHTML = "";
    sidebar.innerHTML = "";
}
// ---------------------------------------
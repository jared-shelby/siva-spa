// JS#4 :: "spending.js" 
// => spending page displays, events, and charts

// --------- SPENDING PAGE VARIABLES ---------
// ---------------------------------------

// --------- SPENDING PAGE FUNCTIONS ---------
// display universal info for spending page
function setupSpending() {
    
}
// ---------------------------------------

// --------- SPENDING PAGE FUNCTIONALITY ---------
spending.addEventListener("click", event => {

    // sanitize page
    sanitize();

    // add logo to logobar
    displayLogo("./assets/spending.png");

    // initiate fetch request; 
    // use pessimistic rendering to load content once api has been successfully queried
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {

            // setup page
            setupSpending();

        });

})
// ---------------------------------------

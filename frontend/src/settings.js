// JS#5 :: "settings.js" 
// => settings page displays & events

// --------- SETTINGS PAGE VARIABLES ---------
// ---------------------------------------

// --------- SETTINGS PAGE FUNCTIONS ---------
// display universal info for settings page
function setupSettings(data) {
    main.innerHTML = `
        <h1 class="title">Settings</h1>
        <h2 class="subtitle">Manage your account.</h2>
        <h3>Account details:</h3>
        <ul>
            <li><strong>Name: </strong><span id="name">${data.name}</span></li>
            <li><strong>Email: </strong><span id="email">${data.email}</span></li>
        </ul>
        <button id="editAccountDetails" class="button is-light">Edit account details</button>
        <h3>Statistics:</h3>
        <ul>
            <li><strong>Current milestones: </strong>${data.milestones.length}</li>
            <li><strong>Most recent transaction: </strong>${data.transactions[0].date}</li>
        </ul>
    `;
}

// display site instructions
function displaySiteInstructions() {
    sidebar.innerHTML = `
        <div class="content">
            <hr/>
            <h1 class="title is-size-4 has-text-centered">Welcome to SIVA</h1>
            <p class="has-text-centered">
                <strong>SIVA</strong> provides a simple interface for managing your finances.
                This single-page application has a Javascript frontend that makes requests
                to a Ruby on Rails API backend. For more information, visit
                <a href="https://github.com/jared-shelby/siva-spa" target="blank">the repo on Github</a>.
            </p>
            <p>*How to use <strong>SIVA</strong>:</p>
            <ul>
                <li><strong>Home: </strong>See an overview of your account & finances.</li>
                <li><strong>Milestones: </strong>Create & view savings goals & track your progress.</li>
                <li><strong>Spending: </strong>Save transactions & track your expenses by category.</li>
                <li><strong>Settings: </strong>Edit account information & see relevant statistics.</li>
            </ul>
        </div>
    `;
}

// display edit account details form & handle patch request
function displayEditAccountDetailsForm() {
    let currentName = document.getElementById("name").innerHTML;
    let currentEmail = document.getElementById("email").innerHTML;

    sidebar.innerHTML = `
        <div id="form">
            <hr/><h3 class="title is-size-4">Edit Account Details</h3>
            <div class="field">
                <label class="label">First Name</label>
                <div class="control">
                    <input id="newFirstname" class="input" type="text" value=${currentName.split(" ")[0]}>
                </div>
            </div>

            <div class="field">
                <label class="label">Last Name</label>
                <div class="control">
                    <input id="newLastname" class="input" type="text" value=${currentName.split(" ")[1]}>
                </div>
            </div>

            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input id="newEmail" class="input" type="email" value=${currentEmail}>
                </div>
            </div>
            
            <div class="field is-grouped">
                <div class="control">
                    <button id="submit" class="button is-dark">Submit</button>
                </div>
                <div class="control">
                    <button id="cancel" class="button is-light">Cancel</button>
                </div>
            </div>
        </div>
    `;

    let submit = document.getElementById("submit"); // submit edit account details button
    let cancel = document.getElementById("cancel"); // cancel edit account details button

    // if cancel button is clicked, display site instructions
    cancel.addEventListener("click", event => displaySiteInstructions());

    // if submit button is clicked, send patch request with new account details
    submit.addEventListener("click", event => {
        let newName = `${document.getElementById("newFirstname").value} ${document.getElementById("newLastname").value}`;
        let newEmail = document.getElementById("newEmail").value;

        let body = { 
            name: newName,
            email: newEmail 
        };
        
        let config = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch(`${URL}/users/${userId}`, config)
            .then(response => response.json())
            .then(data => {
                document.getElementById("name").innerHTML = `${data.name}`;
                document.getElementById("email").innerHTML = `${data.email}`;
                notify("Your account details have been updated successfully.");
                displaySiteInstructions();
            });
    })
}
// ---------------------------------------

// --------- SETTINGS PAGE FUNCTIONALITY ---------
settings.addEventListener("click", event => {

    // sanitize page
    sanitize();

    // add logo to logobar
    displayLogo("./assets/settings.png");

    // display site instructions
    displaySiteInstructions();

    // initiate fetch request; 
    // use pessimistic rendering to load content once api has been successfully queried
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {

            // setup page
            setupSettings(data);

            // display edit account details form & handle patch request
            let editAccountDetails = document.getElementById("editAccountDetails");
            editAccountDetails.addEventListener("click", event => displayEditAccountDetailsForm());
            
        });

})
// ---------------------------------------

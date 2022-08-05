// JS#2 :: "home.js" 
// => home page displays & events

// --------- HOME PAGE FUNCTIONS ---------
// display logo for home page
function displayHomeLogo() {
    sidebar.innerHTML = `
        <div class="pl-4">
            <img src="./assets/home.png">
        </div>
    `;
}

// display universal info for home page
function setupHome(userName) {
    content.innerHTML = `
        <h1 class="title">Home</h1>
        <h2 class="subtitle">Welcome back, ${userName.split(" ")[0]}.</h2>
        <div class="columns">
            <div id="milestoneColumn" class="column is-5"></div>
            <div class="column is-1"></div>
            <div id="spendingColumn" class="column is-5"></div>
            <div class="column is-1"></div>
        </div>
    `;
}

// display featured milestone
function displayFeaturedMilestone(featuredMilestone) {
    let milestoneColumn = document.getElementById("milestoneColumn");
    milestoneColumn.innerHTML = `
        <h3>Featured Milestone:</h3>
        <p>Your target date is quickly approaching -- keep saving!</p>
    `;
    milestoneColumn.appendChild(createFeaturedMilestoneCard(featuredMilestone));
}

// create featured milestone card
function createFeaturedMilestoneCard(featuredMilestone) {
    let featuredMilestoneCard = document.createElement("div");
    featuredMilestoneCard.classList.add("card")
    featuredMilestoneCard.dataset.id = featuredMilestone.id;
    featuredMilestoneCard.innerHTML = `
        <div class="card-image">
            <img src=${featuredMilestone.image} style="width: 100%; height: 250px">
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <img src="./assets/milestone.png" width="50px" height="50px">
                </div>
                <div class="media-content">
                    <p class="title is-4">${featuredMilestone.name}</p>
                    <p class="subtitle is-6">${featuredMilestone.amount_pretty} by ${featuredMilestone.target}</p>
                </div>
            </div>
        
            <div class="content">
                <progress class="progress is-small is-dark" max=${parseFloat(featuredMilestone.amount)} value=${parseFloat(featuredMilestone.funded)}></progress>
                <p><em><strong>${featuredMilestone.funded_pretty}</strong> contributed so far.</em></p>
                <p>${featuredMilestone.description}</p>
            </div>
        </div>
    `
    return featuredMilestoneCard;
}
// ---------------------------------------

// --------- MAIN FUNCTIONALITY ---------
home.addEventListener("click", event => {
    
    // sanitize page
    sanitize();

    // add logo to logobar
    displayHomeLogo();

    // initiate fetch request; 
    // use pessimistic rendering to load content once api has been successfully queried
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {

            // display universal home page info
            let userName = data.name;
            setupHome(userName);

            // display featured milestone if user has any milestones
            if (data.milestones.length > 0) {
                let featuredMilestone = data.milestones.find(milestone => !milestone["completed?"]);
                displayFeaturedMilestone(featuredMilestone);
            }

            // display spending insights if user has any transactions
            if (data.transactions.length > 0) {
            }

        });

})
// ---------------------------------------

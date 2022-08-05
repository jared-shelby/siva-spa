// JS#3 :: "milestones.js" 
// => milestones page displays, events, and charts

// --------- MILESTONES PAGE VARIABLES ---------
let counter = 0; // alternate milestone display in grid
// ---------------------------------------


// --------- MILESTONES PAGE FUNCTIONS ---------
// display universal info for milestones page
function setupMilestones() {
    main.innerHTML = `
        <h1 class="title">Milestones</h1>
        <h2 class="subtitle">Focus on your goals & track your progress.</h2>
        <button id="addNewMilestone" class="button is-dark"><strong>+</strong></button>
        <br/><br/>
        <div id="grid" class="columns">
            <div id="even" class="column is-5"></div>
            <div class="column is-1"></div>
            <div id="odd" class="column is-5"></div>
            <div class="column is-1"></div>
        </div>  
    `;
}

// display all milestones in grid
function displayMilestonesInGrid(milestones) {
    // display milestones in alternating pattern across grid
    milestones.forEach(milestone => {
        if (counter % 2 === 0 || counter === 0) {
            even.appendChild(createMilestoneCard(milestone));
            counter++;
        } else {
            odd.appendChild(createMilestoneCard(milestone))
            counter++;
        }
    });
}

// create milestone card
function createMilestoneCard(milestone) {
    let newMilestoneCard = document.createElement("div");
    newMilestoneCard.classList.add("card", "mb-4");
    newMilestoneCard.dataset.id = milestone.id;
    newMilestoneCard.innerHTML = `
        <div class="card-image">
            <img src=${milestone.image} style="width: 100%; height: 250px">
        </div>

        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <img src="./assets/milestones.png" width="50px" height="50px">
                </div>
                <div class="media-content">
                    <p class="title is-4">${milestone.name}</p>
                    <p class="subtitle is-6">${milestone.amount_pretty} by ${milestone.target}</p>
                </div>
            </div>
    
            <div class="content">
                <progress class="progress is-small ${milestone["completed?"] ? "is-success" : "is-dark"}" max=${parseFloat(milestone.amount)} value=${parseFloat(milestone.funded)}></progress>
                <p><em><strong>${milestone.funded_pretty}</strong> contributed so far.</em></p>
                <p>${milestone.description}</p>
                <button id="fundMilestone" class="button is-small is-light">Fund</button>
                <button id="deleteMilestone" class="button is-small is-dark">Delete</button>
            </div>
        </div>
    `;
    return newMilestoneCard;   
}

function generateMilestonesChart() {
    sidebar.innerHTML = "";
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            let newMilestonesChart = document.createElement("div");
            newMilestonesChart.innerHTML = `
                <hr/>
                <h3 class="title is-size-4 has-text-centered">All Goals</h3>
                <canvas id="milestonesChart"></canvas>
            `;
            sidebar.appendChild(newMilestonesChart);
        
            let labels = []; // all milestone names
            let amounts = []; // all milestone amounts
            let colors = [ // possible color options
                "rgb(214, 40, 40)",
                "rgb(247, 127, 0)",
                "rgb(252, 191, 73)",
                "rgb(234, 226, 183)",
                "rgb(0, 48, 73)",
                "rgb(42, 157, 143)",
                "rgb(137, 176, 174)"
            ];
            let backgroundColor = []; // all milestone colors

            let index = 0;
            data.milestones.forEach(milestone => {
                labels.push(milestone.name);
                amounts.push(milestone.amount);
                backgroundColor.push(colors[index % colors.length]);
                index += 1;
            });

            let chartData = {
                labels: labels,
                datasets: [{
                    label: "All Goals",
                    data: amounts,
                    backgroundColor: backgroundColor,
                    hoverOffset: 4
                }]
            };
        
            let config = {
                type: 'pie',
                data: chartData,
            };
        
            new Chart(document.getElementById("milestonesChart"), config);
        });
}

// display new milestone form & handle post request
function displayNewMilestoneForm() {
    sidebar.innerHTML = `
        <div id="form">
            <hr/>
            <h3 class="title is-size-4 has-text-centered">Create New Milestone</h3>
            <div class="field">
                <label class="label">Name</label>
                <div class="control">
                    <input id="newMilestoneName" class="input" type="text" placeholder="e.g., Summer Vacation">
                </div>
            </div>

            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                    <textarea id="newMilestoneDescription" class="textarea" placeholder="e.g., Super excited to have some summer fun with family & friends!"></textarea>
                </div>
            </div>

            <div class="field">
                <label class="label">Amount ($)</label>
                <div class="control">
                    <input id="newMilestoneAmount" class="input" type="number" placeholder="e.g., 1000">
                </div>
            </div>

            <div class="field">
                <label class="label">Target Date</label>
                <div class="control">
                    <input id="newMilestoneTarget" class="input" type="date" placeholder="e.g., 07/01/2022">
                </div>
            </div>

            <div class="field">
                <label class="label">Image (URL)</label>
                <div class="control">
                    <input id="newMilestoneImage" class="input" type="text" placeholder="e.g., https://www.siva.com/image_url">
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

    let submit = document.getElementById("submit"); // submit new milestone button
    let cancel = document.getElementById("cancel"); // cancel new milestone button

    // if cancel button is clicked, clear form & display milestones chart
    cancel.addEventListener("click", event => {
        generateMilestonesChart();
    })

    // if submit button is clicked, submit post request & display new milestone
    submit.addEventListener("click", event => {
        let newMilestoneName = document.getElementById("newMilestoneName").value;
        let newMilestoneDescription = document.getElementById("newMilestoneDescription").value;
        let newMilestoneAmount = document.getElementById("newMilestoneAmount").value;
        let newMilestoneTarget = document.getElementById("newMilestoneTarget").value;
        let newMilestoneImage = document.getElementById("newMilestoneImage").value;

        let body = {
            name: newMilestoneName,
            description: newMilestoneDescription,
            amount: newMilestoneAmount,
            funded: 0,
            target: newMilestoneTarget,
            image: newMilestoneImage,
            user_id: userId
        };

        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        };

        // initiate request
        fetch(`${URL}/milestones`, config)
            .then(response => response.json())
            .then(data => {
                if (counter % 2 === 0 || counter === 0) {
                    even.appendChild(createMilestoneCard(data));
                    counter++;
                } else {
                    odd.appendChild(createMilestoneCard(data))
                    counter++;
                }
                notify(`${data.name} has been created successfully! Happy saving!`);
                generateMilestonesChart();
            });
    })
}

// display fund milestone form & handle patch request
function displayFundMilestoneForm(eventTarget) {
    sidebar.innerHTML = `
        <div id="form">
            <hr/>
            <h3 class="title is-size-4 has-text-centered">Fund Milestone: ${eventTarget.parentElement.parentElement.parentElement.querySelector("p.title").innerHTML}</h3>
            <div class="field">
                <label class="label">Amount ($)</label>
                <div class="control">
                    <input id="newFundAmount" class="input" type="number" placeholder="e.g., 1000">
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

    let submit = document.getElementById("submit"); // submit fund milestone button
    let cancel = document.getElementById("cancel"); // cancel fund milestone button

    cancel.addEventListener("click", event => {
        generateMilestonesChart();
    });

    submit.addEventListener("click", event => {
        let newFundAmount = document.getElementById("newFundAmount").value;
        
        let body = {
            funded: newFundAmount
        };

        let config = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body) 
        };

        let datasetId = eventTarget.parentElement.parentElement.parentElement.dataset.id;

        // initiate patch request
        fetch(`${URL}/milestones/${datasetId}`, config)
            .then(response => response.json())
            .then(data => {
                // update progress bar
                let progress = document.querySelector(`[data-id="${datasetId}"]`).querySelector("progress");
                progress.value = data.funded;
                if (data["completed?"]) {
                    progress.classList.remove("is-dark");
                    progress.classList.add("is-success");
                }
                notify(`Successfully funded ${data.name}! You've contributed ${data.funded_pretty} so far.`);
                generateMilestonesChart();
            });
    })
}

// delete milestone
function deleteMilestone(eventTarget) {
    let datasetId = eventTarget.parentElement.parentElement.parentElement.dataset.id;

    let config = {
        method: "DELETE"
    };

    fetch(`${URL}/milestones/${datasetId}`, config)
        .then(response => response.json())
        .then(data => {
            // remove card
            eventTarget.parentElement.parentElement.parentElement.remove();
            counter--;
            notify(`${data.name} has been deleted successfully.`);
            generateMilestonesChart();
        });
}
// ---------------------------------------

// --------- MAIN FUNCTIONALITY ---------
milestones.addEventListener("click", event => {

    // sanitize page
    sanitize();

    // add logo to logobar
    displayLogo("./assets/milestones.png");

    // initiate fetch request; 
    // use pessimistic rendering to load content once api has been successfully queried
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {

            // setup page
            setupMilestones();

            // display all milestones on grid
            let milestones = data.milestones
            let grid = document.getElementById("grid"); // container grid
            let even = document.getElementById("even"); // left side columns
            let odd = document.getElementById("odd"); // right side columns
            displayMilestonesInGrid(milestones);

            // display chart with milestone info unless user has no milestones
            if (data.milestones.length > 0) {
                generateMilestonesChart();
            }

            // listen for adding new milestone & handle post request
            let addNewMilestone = document.getElementById("addNewMilestone");
            addNewMilestone.addEventListener("click", event => displayNewMilestoneForm());

            // listen for funding or deleting an existing milestone
            grid.addEventListener("click", event => {
                if (event.target.id === "fundMilestone") {
                    displayFundMilestoneForm(event.target);
                } else if (event.target.id === "deleteMilestone") {
                    deleteMilestone(event.target);
                }
            })
            
        });

})
// ---------------------------------------

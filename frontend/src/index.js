// constants
const URL = "http://localhost:3000"
const content = document.getElementById("content");
const navbarHome = document.getElementById("home");
const navbarGoals = document.getElementById("goals");
const navbarSpending = document.getElementById("spending");
const navbarSettings = document.getElementById("settings");
const options = document.getElementById("options");
const charts = document.getElementById("charts");
const sidebar = document.getElementById("sidebar");

// sanitize 
function sanitize() {
    sidebar.innerHTML = "";
    content.innerHTML = "";
    options.innerHTML = "";
    charts.innerHTML = "";
}

// HOME PAGE
navbarHome.addEventListener("click", event => {
    // sanitize options div upon load (make this a function/adjust this setting)
    sanitize();
    sidebar.innerHTML = `<div class="pl-4"><img src="./assets/home.png"></div>`
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = 
                `<h1 class="title">Home</h1>
                <h2 id="displayName" class="subtitle">Welcome back, ${data.name.split(" ")[0]}.</h2>
                <p>${data.total_spent} spent so far.`;
        })
})

// GOALS PAGE
navbarGoals.addEventListener("click", event => {
    sanitize();
    sidebar.innerHTML = `<div class="pl-4"><img src="./assets/goals.png"></div>`
    // get all goals & display
    fetch(`${URL}/goals`)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = 
                `<h1 class="title">Milestones</h1>
                <h2 class="subtitle">Focus on your goals & track your progress.</h2>
                <button id="addNewGoal" class="button is-dark"><strong>+</strong></button>
                <br/><br/>
                <div id="goalColumns" class="columns">
                    <div id="even" class="column is-5"></div>
                    <div class="column is-1"></div>
                    <div id="odd" class="column is-5"></div>
                    <div class="column is-1"></div>
                </div>`;
            let goalColumns = document.getElementById("goalColumns");
            let evenColumn = document.getElementById("even");
            let oddColumn = document.getElementById("odd");
            let num = 0;
            data.forEach(goal => {
                if (num % 2 === 0 || num === 0) {
                    evenColumn.appendChild(createGoalCard(goal));
                    num += 1;
                } else {
                    oddColumn.appendChild(createGoalCard(goal))
                    num += 1;
                }
            });

            generateGoalsChart();

            // once all goals are listed, listen for click on edit or delete buttons
            goalColumns.addEventListener("click", event => {
                if (event.target.id === "deleteGoal") {
                    // find nearest goal (div), get dataset id, and send delete request
                    fetch(`${URL}/goals/${event.target.parentElement.parentElement.parentElement.dataset.id}`, { method: "DELETE" })
                        .then(response => response.json())
                        .then(data => {
                            event.target.parentElement.parentElement.parentElement.remove()
                            num -= 1;
                            generateGoalsChart();
                        });
                } else if (event.target.id === "fundGoal") {
                    // display form to fund goal (send goal name as a string & goal dataset id)
                    charts.innerHTML = fundGoalForm(event.target.parentElement.parentElement.querySelector("#media #media-content #title"), event.target.parentElement.parentElement.parentElement.dataset.id);

                    let form = document.getElementById("form");
                    let submit = document.getElementById("submit");
                    let cancel = document.getElementById("cancel");

                    cancel.addEventListener("click", event => form.remove());
                    submit.addEventListener("click", event => {
                        let newAmount = document.getElementById("newAmount").value;
                        
                        // find nearest goal (div), get dataset id, and send patch request
                        let updatedGoalBody = {
                            funded: newAmount
                        }

                        let configObj = {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(updatedGoalBody)
                        }
                        fetch(`${URL}/goals/${event.target.parentElement.parentElement.parentElement.dataset.id}`, configObj)
                            .then(response => response.json())
                            .then(data => {
                                // update progress bar
                                let progress = document.querySelector(`[data-id="${event.target.parentElement.parentElement.parentElement.dataset.id}"]`).querySelector("progress");
                                progress.value = data.funded;
                                if (data["completed?"]) {
                                    progress.classList.remove("is-dark");
                                    progress.classList.add("is-success");
                                }
                                form.remove();
                                notify(`Successfully funded ${data.name}! You've contributed ${data.funded_pretty} so far.`);
                                generateGoalsChart();
                            });
                    })
                }
            })
        
            // button to add new goal 
            let newGoalButton = document.getElementById("addNewGoal");
            newGoalButton.addEventListener("click", event => {
                charts.innerHTML = newGoalForm();

                let form = document.getElementById("form");
                let submit = document.getElementById("submit");
                let cancel = document.getElementById("cancel");

                cancel.addEventListener("click", event => {
                    form.remove();
                    generateGoalsChart();
                });
                submit.addEventListener("click", event => {
                    let newGoalName = document.getElementById("newName").value;
                    let newGoalDescription = document.getElementById("newDescription").value;
                    let newGoalAmount = document.getElementById("newAmount").value;
                    let newGoalTarget = document.getElementById("newTarget").value;
                    let newGoalImage = document.getElementById("newImage").value;
                    
                    let newGoalBody = {
                        name: newGoalName,
                        description: newGoalDescription,
                        amount: newGoalAmount,
                        funded: 0,
                        target: newGoalTarget,
                        image: newGoalImage,
                        user_id: 1
                    };
                    
                    let configurationObject = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(newGoalBody)
                    }
    
                    fetch(`${URL}/goals`, configurationObject)
                        .then(response => response.json())
                        .then(data => {
                            if (num % 2 === 0 || num === 0) {
                                evenColumn.appendChild(createGoalCard(data));
                                num += 1;
                            } else {
                                oddColumn.appendChild(createGoalCard(data))
                                num += 1;
                            }
                            form.remove();
                            notify("New milestone successfully created. Happy saving!");
                        });
                })
            })
        })
})

function createGoalCard(goal) {
    let newGoalCard = document.createElement("div");
    newGoalCard.classList += "card mb-4";
    newGoalCard.dataset.id = goal.id;
    newGoalCard.innerHTML =
    `<div class="card-image">
        <img src=${goal.image} style="width: 100%; height: 250px">
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
            <img src="./assets/goals.png" width="50px" height="50px">
        </div>
        <div class="media-content">
          <p class="title is-4">${goal.name}</p>
          <p class="subtitle is-6">${goal.amount_pretty} by ${goal.target}</p>
        </div>
      </div>
  
      <div class="content">
        <progress class="progress is-small ${goal["completed?"] ? "is-success" : "is-dark"}" max=${parseFloat(goal.amount)} value=${parseFloat(goal.funded)}></progress>
        <p>${goal.description}</p>
        <button id="fundGoal" class="button is-small is-light">Fund</button>
        <button id="deleteGoal" class="button is-small is-dark">Delete</button>
      </div>
    </div>`
    return newGoalCard;
}

function newGoalForm() {
    return `
    <div id="form">
        <hr/><h3 class="title is-size-4">Create New Milestone</h3>
        <div class="field">
            <label class="label">Name</label>
            <div class="control">
                <input id="newName" class="input" type="text" placeholder="e.g., Summer Vacation">
            </div>
        </div>

        <div class="field">
            <label class="label">Description</label>
            <div class="control">
                <textarea id="newDescription" class="textarea" placeholder="e.g., Super excited to have some summer fun with family & friends!"></textarea>
            </div>
        </div>

        <div class="field">
            <label class="label">Amount ($)</label>
            <div class="control">
                <input id="newAmount" class="input" type="number" placeholder="e.g., 1000">
            </div>
        </div>

        <div class="field">
            <label class="label">Target Date</label>
            <div class="control">
                <input id="newTarget" class="input" type="date" placeholder="e.g., 07/01/2022">
            </div>
        </div>

        <div class="field">
            <label class="label">Image (URL)</label>
            <div class="control">
                <input id="newImage" class="input" type="text" placeholder="e.g., https://www.siva.com/image_url">
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
    </div>`
}

function fundGoalForm(goalName, goalDatasetId) {
    return `
    <div id="form" data-id=${goalDatasetId}>
        <hr/><h3 class="title is-size-4">Fund Goal: ${goalName}</h3>
        <div class="field">
            <label class="label">Amount ($)</label>
            <div class="control">
                <input id="newAmount" class="input" type="number" placeholder="e.g., 1000">
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
    </div>`
}

// insert notification in right sidebar w/ delete button
function notify(string) {
    let notification = document.createElement("div");
    notification.classList += "notification";
    notification.innerHTML = 
        `<button id="deleteNotification" class="delete"></button>
        <strong>${string}</strong>`
    charts.appendChild(notification);
    let deleteNotification = document.getElementById("deleteNotification");
    deleteNotification.addEventListener("click", event => notification.remove());
}

function generateGoalsChart() {
    // generate polar area chart for goals
    charts.innerHTML = "";
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            let newChart = document.createElement("div");
            newChart.innerHTML = 
                `<hr/><h3 class="title is-size-4 has-text-centered">All Goals</h3>
                <canvas id="myChart"></canvas>`;
            charts.appendChild(newChart);
            
            let labels = [];
            let amounts = [];
            let backgroundColors = [
                "rgb(214, 40, 40)",
                "rgb(247, 127, 0)",
                "rgb(252, 191, 73)",
                "rgb(234, 226, 183)",
                "rgb(0, 48, 73)",
                "rgb(42, 157, 143)",
                "rgb(137, 176, 174)"
            ];
            let backgroundColor = [];

            let index = 0;
            data.goals.forEach(goal => {
                labels.push(goal.name);
                amounts.push(goal.amount);
                backgroundColor.push(backgroundColors[index % backgroundColors.length]);
                index += 1;
            });

            const chartData = {
                labels: labels,
                datasets: [{
                    label: "All Goals",
                    data: amounts,
                    backgroundColor: backgroundColor,
                    hoverOffset: 4
                }]
            };
        
            const config = {
                type: 'polarArea',
                data: chartData,
            };
        
            const myChart = new Chart(
                document.getElementById('myChart'),
                config
            );
        })
}


// SPENDING PAGE
navbarSpending.addEventListener("click", event => {
    sanitize();
    sidebar.innerHTML = `<div class="pl-4"><img src="./assets/spending.png"></div>`
    fetch(`${URL}/transactions`)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = 
                `<h1 class="title">Spending</h1>
                <h2 id="displayName" class="subtitle">View transactions & set a budget.</h2>
                <button id="addNewTransaction" class="button is-dark"><strong>+</strong></button>
                <br/><br/>`;
            // create table
            let transactionsTable = document.createElement("table");
            transactionsTable.className += "table";
            transactionsTable.innerHTML = 
                `<thead>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Merchant</th>
                    <th>Category</th>
                </thead>
                <tbody id="transactionsTableBody">
                </tbody>`
            content.appendChild(transactionsTable);
            let transactionsTableBody = document.querySelector("#transactionsTableBody");
            data.forEach(transaction => transactionsTableBody.appendChild(createTransactionItem(transaction)))

            generateChart();

            // button to add new transaction 
            let newTransactionButton = document.getElementById("addNewTransaction");
            newTransactionButton.addEventListener("click", event => {
                charts.innerHTML = newTransactionForm();

                let form = document.getElementById("form");
                let submit = document.getElementById("submit");
                let cancel = document.getElementById("cancel");

                cancel.addEventListener("click", event => {
                    form.remove();
                    generateChart();
                });
                submit.addEventListener("click", event => {
                    let newTransactionAmount = document.getElementById("newAmount").value;
                    let newTransactionDate = document.getElementById("newDate").value;
                    let newTransactionMerchant = document.getElementById("newMerchant").value;
                    let newTransactionCategory = document.getElementById("newCategory").selectedIndex + 1;
                    
                    let newTransactionBody = {
                        amount: newTransactionAmount,
                        date: newTransactionDate,
                        merchant: newTransactionMerchant,
                        category_id: newTransactionCategory,
                        user_id: 1
                    };
                    
                    let configurationObject = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(newTransactionBody)
                    }
    
                    fetch(`${URL}/transactions`, configurationObject)
                        .then(response => response.json())
                        .then(data => {
                            transactionsTableBody.appendChild(createTransactionItem(data));
                            form.remove();
                            notify("New transaction successfully created. Happy budgeting!")
                            generateChart();
                        });
                })
            })

        })

    // once all transactions are listed, listen for click on delete button
    content.addEventListener("click", event => {
        if (event.target.id === "deleteTransaction") {
            // find nearest transaction (tr), get dataset id, and send delete request
            fetch(`${URL}/transactions/${event.target.parentElement.dataset.id}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    event.target.parentElement.remove();
                    notify("Transaction successfully deleted.")
                    generateChart();
                });
        }
    })
})

function createTransactionItem(transaction) {
    let newTransactionItem = document.createElement("tr");
    newTransactionItem.dataset.id = transaction.id;
    newTransactionItem.innerHTML =
        `<th>${transaction.date}</th>
        <td>${transaction.amount}</td>
        <td>${transaction.merchant}</td>
        <td>${transaction.category.name}</td>
        <button id="deleteTransaction" class="delete"></button>`
    return newTransactionItem;
}

function generateChart() {
    // once all transactions are compiled, generate a pie chart
    charts.innerHTML = "";
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            let newChart = document.createElement("div");
            newChart.innerHTML = 
                `<hr/><h3 class="title is-size-4 has-text-centered">All Transactions</h3>
                <canvas id="myChart"></canvas>`;
            charts.appendChild(newChart);

            const chartData = {
                labels: [
                    "Food/Drink",
                    "Entertainment",
                    "Bills",
                    "Health/Beauty",
                    "Transportation",
                    "Shopping",
                    "Other"
                ],
                datasets: [{
                    label: "All Transactions",
                    data: [
                        data.total_categories["Food/Drink"],
                        data.total_categories["Entertainment"],
                        data.total_categories["Bills"],
                        data.total_categories["Health/Beauty"],
                        data.total_categories["Transportation"],
                        data.total_categories["Shopping"],
                        data.total_categories["Other"],
                    ],
                    backgroundColor: [
                    "rgb(214, 40, 40)",
                    "rgb(247, 127, 0)",
                    "rgb(252, 191, 73)",
                    "rgb(234, 226, 183)",
                    "rgb(0, 48, 73)",
                    "rgb(42, 157, 143)",
                    "rgb(137, 176, 174)"
                    ],
                    hoverOffset: 4
                }]
            };
        
            const config = {
                type: 'pie',
                data: chartData,
            };
        
            const myChart = new Chart(
                document.getElementById('myChart'),
                config
            );
        })
}

function newTransactionForm() {
    return `
    <div id="form">
        <hr/><h3 class="title is-size-4">Create New Transaction</h3>
        <div class="field">
            <label class="label">Amount ($)</label>
            <div class="control">
                <input id="newAmount" class="input" type="number" placeholder="e.g., 1000">
            </div>
        </div>

        <div class="field">
            <label class="label">Date</label>
            <div class="control">
                <input id="newDate" class="input" type="date" placeholder="e.g., 08/01/2022">
            </div>
        </div>

        <div class="field">
            <label class="label">Merchant</label>
            <div class="control">
                <input id="newMerchant" class="input" type="text" placeholder="e.g., Coffee Bean">
            </div>
        </div>

        <div class="field">
            <label class="label">Category</label>
            <div class="select">
                <select id="newCategory">
                    <option>Food/Drink</option>
                    <option>Entertainment</option>
                    <option>Bills</option>
                    <option>Health/Beauty</option>
                    <option>Transportation</option>
                    <option>Shopping</option>
                    <option>Other</option>
                </select>
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
    </div>`
}

// SETTINGS PAGE
navbarSettings.addEventListener("click", event => {
    sanitize();
    sidebar.innerHTML = `<div class="pl-4"><img src="./assets/settings.png"></div>`
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = 
            `<h1 class="title">Settings</h1>
            <h2 class="subtitle">Manage your account.</h2>
            <h3>Account details:</h3>
            <ul>
                <li><strong>Name: </strong><span id="name">${data.name}</span></li>
                <li><strong>Email: </strong><span id="email">${data.email}</span></li>
            </ul>
            <button id="editAccountDetails" class="button is-light">Edit account details</button>
            <h3>Statistics:</h3>
            <ul>
                <li><strong>Current milestones: </strong>${data.goals.length}</li>
                <li><strong>Most recent transaction: </strong>${data.transactions[0].date}</li>
            </ul>
            <h3>Milestones achieved:</h3>
            <ul>
                <li><strong>[Ski Trip:] </strong>[$20,000]</li>
            </ul>`;

        let editAccountDetails = document.getElementById("editAccountDetails");
        editAccountDetails.addEventListener("click", event => {
            charts.innerHTML = editAccountDetailsForm(document.getElementById("name").innerHTML, document.getElementById("email").innerHTML);

            let form = document.getElementById("form");
            let submit = document.getElementById("submit");
            let cancel = document.getElementById("cancel");
            cancel.addEventListener("click", event => form.remove());
            submit.addEventListener("click", event => {
                let newName = `${document.getElementById("newFirstname").value} ${document.getElementById("newLastname").value}`;
                let newEmail = document.getElementById("newEmail").value;
        
                let requestBody = { 
                    name: newName,
                    email: newEmail 
                };
                
                let configObject = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                }
    
                fetch(`${URL}/users/1`, configObject)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("name").innerHTML = `${data.name}`;
                        document.getElementById("email").innerHTML = `${data.email}`;
                        form.remove();
                        notify("Your account details have been updated successfully.")
                    });
            })
        })
    })
})

function editAccountDetailsForm(currentName, currentEmail) {
    return `
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
    </div>`
}

// start out on home page upon refresh/load
navbarHome.click();
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
                <h2 id="displayName" class="subtitle">Focus on your goals & track your progress.</h2>`;
            data.forEach(goal => content.appendChild(createGoalCard(goal)));
        })

        // display options below all goals
        options.innerHTML = 
            `<h3>Options</h3>
            <button id="newGoal">Add Goal</button> <br/>
            <label for="goalName">Goal Name: </label>
            <input id="goalName" type="text" name="goalName"/> <br/>
            <label for="goalAmount">Goal Amount: $</label>
            <input id="goalAmount" type="text" name="goalAmount"/> <br/>
            <label for="goalImage">Goal Image Link: </label>
            <input id="goalImage" type="text" name="goalImage"/>`;
        
        // button to add new goal 
        let newGoalButton = document.querySelector("#newGoal");
        newGoalButton.addEventListener("click", event => {
            let newGoalName = document.querySelector("#goalName").value;
            let newGoalAmount = document.querySelector("#goalAmount").value;
            let newGoalImage = document.querySelector("#goalImage").value;
            
            let newGoalBody = {
                name: newGoalName,
                amount: newGoalAmount,
                target: "2022-08-01",
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
                .then(data => content.appendChild(createGoalCard(data)));
        })

        // once all goals are listed, listen for click on edit or delete buttons
        content.addEventListener("click", event => {
            if (event.target.id === "deleteGoal") {
                // find nearest goal (div), get dataset id, and send delete request
                fetch(`${URL}/goals/${event.target.parentElement.dataset.id}`, { method: "DELETE" })
                    .then(response => response.json())
                    .then(data => event.target.parentElement.remove());
            } else if (event.target.id === "editGoal") {
                // find nearest goal (div), get dataset id, and send patch request
                let updatedGoalBody = {
                }
                let configObj = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(updatedGoalBody)
                }
                fetch(`${URL}/goals/${event.target.parentElement.dataset.id}`, configObj)
                    .then(response => response.json())
                    .then(console.log);
            }
        })
})

function createGoalCard(goal){
    let newGoalCard = document.createElement("div");
    newGoalCard.dataset.id = goal.id;
    newGoalCard.innerHTML = 
        `<h3>${goal.name}</h3>
        <button id="editGoal">Edit</button>
        <button id="deleteGoal">Delete</button>
        <ul>
            <li>Amount: $${goal.amount}</li>
            <li>Target Date: ${goal.date}</li>
            <img src=${goal.image} width=100px height=100px/>
        </ul>`
    return newGoalCard;
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
                <h2 id="displayName" class="subtitle">View transactions & set a budget.</h2>`;
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

            // once all transactions are compiled, generate a pie chart
            let newChart = document.createElement("canvas");
            newChart.id = "myChart";
            charts.appendChild(newChart);
            const chartData = {
                labels: [
                  'Red',
                  'Blue',
                  'Yellow'
                ],
                datasets: [{
                  label: 'My First Dataset',
                  data: [300, 50, 100],
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
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

    options.innerHTML = 
        `<h3>Options</h3>
        <button id="addTransactionButton">Add Transaction</button>
        <label for="transactionAmount">Transaction amount ($XX.XX): $ </label>
        <input id="transactionAmount" type="number" name="transactionAmount"/> <br/>
        <label for="transactionDate">Transaction date (Month Day, Year): </label>
        <input id="transactionDate" type="text" name="transactionDate"/> <br/>
        <label for="transactionMerchant">Merchant (e.g., Starbucks): </label>
        <input id="transactionMerchant" type="text" name="transactionMerchant"/>`;

    let addTransactionButton = document.querySelector("#addTransactionButton");
    addTransactionButton.addEventListener("click", event => {
        let newTransactionAmount = document.querySelector("#transactionAmount").value;
        let newTransactionDate = document.querySelector("#transactionDate").value;
        let newTransactionMerchant = document.querySelector("#transactionMerchant").value;
        
        let newTransactionBody = {
            amount: newTransactionAmount,
            date: newTransactionDate,
            merchant: newTransactionMerchant,
            user_id: 1,
            category_id: 1
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
            .then(data => transactionsTableBody.appendChild(createTransactionItem(data)));
    })

    // once all transactions are listed, listen for click on delete button
    content.addEventListener("click", event => {
        if (event.target.id === "deleteTransaction") {
            // find nearest transaction (tr), get dataset id, and send delete request
            fetch(`${URL}/transactions/${event.target.parentElement.dataset.id}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => event.target.parentElement.remove());
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
            </ul>`;

        let editAccountDetails = document.getElementById("editAccountDetails");
        editAccountDetails.addEventListener("click", event => {
            options.innerHTML = editAccountDetailsForm(document.getElementById("name").innerHTML, document.getElementById("email").innerHTML);

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
                    });
            })
        })
    })
})

function editAccountDetailsForm(currentName, currentEmail) {
    return `
    <div id="form">
        <hr/><h3>Edit Account Details</h3>
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
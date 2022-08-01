const URL = "http://localhost:3000"
const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");
const navbarSettings = document.getElementById("settings");
const options = document.querySelector("#options");

// HOME PAGE
homeButton.addEventListener("click", event => {
    // sanitize options div upon load (make this a function/adjust this setting)
    options.innerHTML = "";
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = 
                `<h1 class="title">Home</h1>
                <h2 id="displayName" class="subtitle">Welcome back, ${data.name.split(" ")[0]}.</h2>`;
        })
})

// GOALS PAGE
goalsButton.addEventListener("click", event => {
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
spendingButton.addEventListener("click", event => {
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
})

function createTransactionItem(transaction) {
    let newTransactionItem = document.createElement("tr");
    newTransactionItem.innerHTML =
        `<th>${transaction.date}</th>
        <td>${transaction.amount}</td>
        <td>${transaction.merchant}</td>
        <td>${transaction.category.name}</td>`
    return newTransactionItem;
}

// SETTINGS PAGE
navbarSettings.addEventListener("click", event => {
    options.innerHTML = "";
    fetch(`${URL}/users/1`)
    .then(response => response.json())
    .then(data => {
        content.innerHTML = 
            `<h1 class="title">Settings</h1>
            <h2 id="displayName" class="subtitle">Manage your account.</h2>
            <ul>
                <li id="userName"><strong>Name: </strong>${data.name}</li>
                <button id="changeName" class="button is-light">Change Name</button>
                <li><strong>Email: </strong>example@siva.com</li>
                <li><strong>Phone number: </strong>(123) 456-7890</li>
            </ul>`;
            
        let changeNameButton = document.querySelector("#changeName");
        changeNameButton.addEventListener("click", event => {
            options.innerHTML = 
                `<hr/><h3 class="is-size-4">Change name form</h3>
                <label for="name">Full Name: </label>
                <input id="name" class="input" type="text" name="name"/>
                <button id="submit" class="button is-dark">Submit</button> <br/>`;
    
            let submitNameChangeButton = document.getElementById("submit");
            submitNameChangeButton.addEventListener("click", event => {
                let newName = document.querySelector("#name").value;
                
                let newNameBody = { name: newName };
                
                let configurationObject = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(newNameBody)
                }
    
                fetch(`${URL}/users/1`, configurationObject)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("userName").innerHTML = `<strong>Name: </strong>${data.name}`;
                        document.querySelector("#name").value = "";
                        options.innerHTML = "";
                    });
            })
        })
    })
})


// start out on home page upon refresh/load
homeButton.click();
const URL = "http://localhost:3000"
const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");
const navbarSettings = document.getElementById("settings");
const options = document.querySelector("#options");

// HOME PAGE
homeButton.addEventListener("click", event => {
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = 
                `<h1 class="title">Home</h1>
                <h2 id="displayName" class="subtitle">Welcome back, ${data.name.split(" ")[0]}.</h2>`;
        })

    // allow user to change their name
    options.innerHTML = 
        `<h3>Options</h3>
        <button id="changeNameButton">Change Name</button> <br/>
        <label for="name">Full Name: </label>
        <input id="name" type="text" name="name"/>`;
    
    let changeNameButton = document.querySelector("#changeNameButton");
    changeNameButton.addEventListener("click", event => {
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
                document.querySelector("#displayName").innerHTML = `Hi, ${data.name}`;
                document.querySelector("#name").value = "";
            });
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
                target: "now",
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
            data.forEach(transaction => content.appendChild(createTransactionItem(transaction)));
        })

    options.innerHTML = 
        `<h3>Options</h3>
        <button id="addTransactionButton">Add Transaction</button>`;
    let addTransactionButton = document.querySelector("#addTransactionButton");
})

function createTransactionItem(transaction){
    let newTransactionItem = document.createElement("li");
    newTransactionItem.innerHTML = `$${transaction.amount} purchase @${transaction.merchant} on ${transaction.date} in category ${transaction.category.name}`
    return newTransactionItem;
}

// SETTINGS PAGE
navbarSettings.addEventListener("click", event => {
    content.innerHTML = 
        `<h1 class="title">Settings</h1>
        <h2 id="displayName" class="subtitle">Manage your account.</h2>`;
    
})


// start out on home page upon refresh/load
homeButton.click();
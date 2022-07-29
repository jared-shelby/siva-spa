const URL = "http://localhost:3000"
const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");
const options = document.querySelector("#options");

// HOME PAGE
homeButton.addEventListener("click", event => {
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.style.backgroundColor = "#edf2f4";
            content.innerHTML = 
                `<h2>Home</h2>
                <p id="displayName">Hi, ${data.name}</p>`;
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
            content.style.backgroundColor = "#edf2f4";
            content.innerHTML = `<h2>Goals</h2>`;
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
})

function createGoalCard(goal){
    let newGoalCard = document.createElement("div");
    newGoalCard.innerHTML = 
        `<h3>${goal.name}</h3>
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
            content.style.backgroundColor = "#edf2f4";
            content.innerHTML = `<h2>Spending</h2>`;
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


// start out on home page upon refresh/load
homeButton.click();
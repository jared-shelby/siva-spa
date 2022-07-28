console.log("JS connected to HTML successfully")

const URL = "http://localhost:3000"
const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");
const options = document.querySelector("#options");

// HOME PAGE
homeButton.addEventListener("click", event => {
    console.log("Home Button Clicked!")
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.style.backgroundColor = "#edf2f4";
            content.innerHTML = 
                `<h2>Home</h2>
                <p>Hi, ${data.name.split(" ")[0]}</p>`;
            options.innerHTML = 
                `<h3>Options</h3>
                <button>Change Name</button>`;
        })
})

// GOALS PAGE
goalsButton.addEventListener("click", event => {
    console.log("Goal Button Clicked!")
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
            <button id="newGoal">Add Goal</button>
            <label for="goalName">Goal Name: </label>
            <input id="goalName" type="text" name="goalName"/> 
            <label for="goalAmount">Goal Amount: $</label>
            <input id="goalAmount" type="text" name="goalAmount"/>
            <label for="goalImage">Goal Image Link: </label>
            <input id="goalImage" type="text" name="goalImage"/>`;
        
        // button to add new goal 
        let newGoalButton = document.querySelector("#newGoal");
        newGoalButton.addEventListener("click", event => {
            console.log("Add new goal button clicked.")
            let newGoalName = document.querySelector("#goalName").value;
            let newGoalAmount = document.querySelector("#goalAmount").value;
            let newGoalImage = document.querySelector("#goalImage").value;
            console.log(newGoalName, newGoalAmount, newGoalImage);
            
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
    console.log("Spending Button Clicked!")
    fetch(`${URL}/transactions`)
        .then(response => response.json())
        .then(data => {
            content.style.backgroundColor = "#edf2f4";
            content.innerHTML = `<h2>Spending</h2>`;
            data.forEach(transaction => content.appendChild(createTransactionItem(transaction)));
        })
    options.innerHTML = 
        `<h3>Options</h3>
        <button id="btn">Add Transaction</button>`;
    // test code below; i think this 
    let btn = document.querySelector("#btn");
    btn.addEventListener("click", event => console.log("btn clicked"));
})

function createTransactionItem(transaction){
    let newTransactionItem = document.createElement("li");
    newTransactionItem.innerHTML = `$${transaction.amount} purchase @${transaction.merchant} on ${transaction.date} in category ${transaction.category.name}`
    return newTransactionItem;
}
console.log("JS connected to HTML successfully")

const URL = "http://localhost:3000"
const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");

// HOME PAGE
homeButton.addEventListener("click", event => {
    console.log("Home Button Clicked!")
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.style.backgroundColor = "#e9c46a";
            content.innerHTML = 
                `<h2>Home</h2>
                <p>Hi, ${data.name.split(" ")[0]}</p>`;
        })
})

// GOALS PAGE
goalsButton.addEventListener("click", event => {
    console.log("Goal Button Clicked!")
    fetch(`${URL}/goals`)
        .then(response => response.json())
        .then(data => {
            content.style.backgroundColor = "#f4a261";
            content.innerHTML = `<h2>Goals</h2>`;
            data.forEach(goal => content.appendChild(createGoalCard(goal)));
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
            content.style.backgroundColor = "#e76f51";
            content.innerHTML = `<h2>Spending</h2>`;
            data.forEach(transaction => content.appendChild(createTransactionItem(transaction)));
        })
})

function createTransactionItem(transaction){
    let newTransactionItem = document.createElement("li");
    newTransactionItem.innerHTML = `$${transaction.amount} purchase @${transaction.merchant} on ${transaction.date} in category ${transaction.category.name}`
    return newTransactionItem;
}
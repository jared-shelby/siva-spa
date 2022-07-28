console.log("JS connected to HTML successfully")

const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");

homeButton.addEventListener("click", event => {
    content.style.backgroundColor = "red";
    content.innerHTML = "<h2>Home</h2>"
})

goalsButton.addEventListener("click", event => {
    content.style.backgroundColor = "yellow";
    content.innerHTML = "<h2>Milestones</h2>"
})

spendingButton.addEventListener("click", event => {
    content.style.backgroundColor = "blue";
    content.innerHTML = "<h2>Spending</h2>"
})
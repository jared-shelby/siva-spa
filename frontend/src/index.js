console.log("JS connected to HTML successfully")

const URL = "http://localhost:3000"
const content = document.querySelector("#content");
const homeButton = document.querySelector("#home");
const goalsButton = document.querySelector("#goals");
const spendingButton = document.querySelector("#spending");

homeButton.addEventListener("click", event => {
    fetch(`${URL}/users/1`)
        .then(response => response.json())
        .then(data => {
            content.style.backgroundColor = "#e9c46a";
            content.innerHTML = 
                `<h2>Home</h2>
                <p>Hi, ${data.name.split(" ")[0]}</p>`;
        })
})

goalsButton.addEventListener("click", event => {
    content.style.backgroundColor = "#f4a261";
    content.innerHTML = "<h2>Milestones</h2>"
})

spendingButton.addEventListener("click", event => {
    content.style.backgroundColor = "#e76f51";
    content.innerHTML = "<h2>Spending</h2>"
})
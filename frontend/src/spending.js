// JS#4 :: "spending.js" 
// => spending page displays, events, and charts

// --------- SPENDING PAGE FUNCTIONS ---------
// display universal info for spending page
function setupSpending() {
    main.innerHTML = `
        <h1 class="title">Spending</h1>
        <h2 class="subtitle">View transactions & set a budget.</h2>
        <button id="addNewTransaction" class="button is-dark"><strong>+</strong></button>
        <br/><br/>
    `;
}

// generate & fill transactions table
function generateTransactionsTable(data) {
    // create table
    let transactionsTable = document.createElement("table");
    transactionsTable.classList.add("table");
    transactionsTable.innerHTML = `
        <thead>
            <th>Date</th>
            <th>Amount</th>
            <th>Merchant</th>
            <th>Category</th>
        </thead>
        <tbody id="transactionsTableBody">
        </tbody>
    `;
    main.appendChild(transactionsTable);

    // fill table
    let transactionsTableBody = document.getElementById("transactionsTableBody");
    data.forEach(transaction => transactionsTableBody.appendChild(createTransactionRow(transaction)));
}

// create table row for a given transaction
function createTransactionRow(transaction) {
    let newTransactionRow = document.createElement("tr");
    newTransactionRow.dataset.id = transaction.id;
    newTransactionRow.innerHTML = `
        <th>${transaction.date}</th>
        <td>${transaction.amount}</td>
        <td>${transaction.merchant}</td>
        <td>${transaction.category.name}</td>
        <button id="deleteTransaction" class="delete"></button>
    `;
    return newTransactionRow;
}

// generate transactions chart
function generateTransactionsChart() {
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            sidebar.innerHTML = `
                <div>
                    <hr/>
                    <h3 class="title is-size-4 has-text-centered">All Transactions</h3>
                    <canvas id="transactionsChart"></canvas>
                </div>
            `;

            let chartData = {
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
        
            let config = {
                type: 'pie',
                data: chartData,
            };
        
            new Chart(document.getElementById('transactionsChart'), config);
        });
}

// display new transaction form & handle post request
function displayNewTransactionForm() {
    sidebar.innerHTML = `
        <div id="form">
            <hr/>
            <h3 class="title is-size-4 has-text-centered">Create New Transaction</h3>
            <div class="field">
                <label class="label">Amount ($)</label>
                <div class="control">
                    <input id="newTransactionAmount" class="input" type="number" placeholder="e.g., 1000">
                </div>
            </div>

            <div class="field">
                <label class="label">Date</label>
                <div class="control">
                    <input id="newTransactionDate" class="input" type="date" placeholder="e.g., 08/01/2022">
                </div>
            </div>

            <div class="field">
                <label class="label">Merchant</label>
                <div class="control">
                    <input id="newTransactionMerchant" class="input" type="text" placeholder="e.g., Coffee Bean">
                </div>
            </div>

            <div class="field">
                <label class="label">Category</label>
                <div class="select">
                    <select id="newTransactionCategory">
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
        </div>
    `;

    let submit = document.getElementById("submit"); // submit new transaction button
    let cancel = document.getElementById("cancel"); // cancel new transaction button

    // if cancel button is clicked, clear form & display transactions chart
    cancel.addEventListener("click", event => {
        generateTransactionsChart();
    })

    // if submit button is clicked, send post request
    submit.addEventListener("click", event => {
        let newTransactionAmount = document.getElementById("newTransactionAmount").value;
        let newTransactionDate = document.getElementById("newTransactionDate").value;
        let newTransactionMerchant = document.getElementById("newTransactionMerchant").value;
        let newTransactionCategory = document.getElementById("newTransactionCategory").selectedIndex + 1;
        
        let body = {
            amount: newTransactionAmount,
            date: newTransactionDate,
            merchant: newTransactionMerchant,
            category_id: newTransactionCategory,
            user_id: userId
        };
        
        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch(`${URL}/transactions`, config)
            .then(response => response.json())
            .then(data => {
                transactionsTableBody.appendChild(createTransactionRow(data));
                notify("New transaction successfully created. Happy budgeting!")
                generateTransactionsChart();
            });
    })
}

// delete a transaction
function deleteTransaction(eventTarget) {
    let datasetId = eventTarget.parentElement.dataset.id;

    let config = {
        method: "DELETE"
    };

    fetch(`${URL}/transactions/${datasetId}`, config)
        .then(response => response.json())
        .then(data => {
            eventTarget.parentElement.remove();
            notify("Transaction successfully deleted.");
            generateTransactionsChart();
        });
}
// ---------------------------------------

// --------- SPENDING PAGE FUNCTIONALITY ---------
spending.addEventListener("click", event => {

    // sanitize page
    sanitize();

    // add logo to logobar
    displayLogo("./assets/spending.png");

    // initiate fetch request; 
    // use pessimistic rendering to load content once api has been successfully queried
    fetch(`${URL}/users/${userId}`)
        .then(response => response.json())
        .then(data => {

            // setup page
            setupSpending();

            // generate transactions table & chart unless user has no transactions
            if (data.transactions.length > 0) {
                generateTransactionsTable(data.transactions);
                generateTransactionsChart();
            }

            // listen for adding new transaction & handle post request
            let addNewTransaction = document.getElementById("addNewTransaction");
            addNewTransaction.addEventListener("click", event => displayNewTransactionForm());

            // listen for deleting a transaction
            main.addEventListener("click", event => {
                if (event.target.id === "deleteTransaction") {
                    deleteTransaction(event.target);
                }
            })

        });

})
// ---------------------------------------

const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const notification = document.getElementById("notification");

const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");
const incomeText = document.getElementById("income-text");
const incomeAmount = document.getElementById("income-amount");
const expenseText = document.getElementById("expense-text");
const expenseAmount = document.getElementById("expense-amount");

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
);
let transactions =
    localStorageTransactions !== null ? localStorageTransactions : [];

function updateLocaleStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showNotification() {
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000);
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Initialize Chart.js Pie Chart
const ctx = document.getElementById("pieChart").getContext("2d");
let pieChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: [],
        datasets: [
            {
                label: "Transactions",
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    },
});

function getCoolColor() {
    const coolColors = ["#3498db", "#1abc9c", "#9b59b6", "#2ecc71", "#16a085"];
    return coolColors[Math.floor(Math.random() * coolColors.length)];
}

function getWarmColor() {
    const warmColors = ["#e74c3c", "#e67e22", "#f39c12", "#d35400", "#c0392b"];
    return warmColors[Math.floor(Math.random() * warmColors.length)];
}

function updatePieChart() {
    pieChart.data.labels = [];
    pieChart.data.datasets[0].data = [];
    pieChart.data.datasets[0].backgroundColor = [];

    transactions.forEach((transaction) => {
        pieChart.data.labels.push(transaction.text);
        pieChart.data.datasets[0].data.push(Math.abs(transaction.amount));

        if (transaction.amount > 0) {
            pieChart.data.datasets[0].backgroundColor.push(getCoolColor());
        } else {
            pieChart.data.datasets[0].backgroundColor.push(getWarmColor());
        }
    });

    pieChart.update();
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "₹";
    const item = document.createElement("li");
    item.classList.add(sign === "₹" ? "plus" : "minus");
    item.innerHTML = `
      <span class="transaction-text">${transaction.text}</span>
      <span class="transaction-amount">${sign}${Math.abs(
        transaction.amount
    )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id
        })"><i class="fa fa-times"></i></button>
  `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts
        .reduce((accumulator, value) => (accumulator += value), 0)
        .toFixed(2);
    const income = amounts
        .filter((value) => value > 0)
        .reduce((accumulator, value) => (accumulator += value), 0)
        .toFixed(2);
    const expense = (
        amounts
            .filter((value) => value < 0)
            .reduce((accumulator, value) => (accumulator += value), 0) * -1
    ).toFixed(2);
    balance.innerText = `₹${total}`;
    moneyPlus.innerText = `₹${income}`;
    moneyMinus.innerText = `₹${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocaleStorage();
    init();
}

function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
    updatePieChart();
}

init();

function addIncome(e) {
    e.preventDefault();
    if (incomeText.value.trim() === "" || incomeAmount.value.trim() === "") {
        showNotification();
    } else {
        const transaction = {
            id: generateID(),
            text: incomeText.value,
            amount: +incomeAmount.value,
        };

        if (transaction.amount > 0) {
            if (transaction.amount >= 250000 && transaction.amount <= 500000) {
                const taxAmount = +(transaction.amount * 0.05).toFixed(2);
                transactions.push({
                    id: generateID(),
                    text: "5% Tax Deducted",
                    amount: -taxAmount,
                });
            } else if (transaction.amount >= 500001 && transaction.amount <= 750000) {
                const taxAmount = +(transaction.amount * 0.10).toFixed(2);
                transactions.push({
                    id: generateID(),
                    text: "10% Tax Deducted",
                    amount: -taxAmount,
                });
            } else if (transaction.amount >= 750001 && transaction.amount <= 1000000) {
                const taxAmount = +(transaction.amount * 0.15).toFixed(2);
                transactions.push({
                    id: generateID(),
                    text: "15% Tax Deducted",
                    amount: -taxAmount,
                });
            } else if (transaction.amount >= 1000001 && transaction.amount <= 1250000) {
                const taxAmount = +(transaction.amount * 0.20).toFixed(2);
                transactions.push({
                    id: generateID(),
                    text: "20% Tax Deducted",
                    amount: -taxAmount,
                });
            } else if (transaction.amount >= 1250001 && transaction.amount <= 1500000) {
                const taxAmount = +(transaction.amount * 0.25).toFixed(2);
                transactions.push({
                    id: generateID(),
                    text: "25% Tax Deducted",
                    amount: -taxAmount,
                });
            } else if (transaction.amount > 1500000) {
                const taxAmount = +(transaction.amount * 0.30).toFixed(2);
                transactions.push({
                    id: generateID(),
                    text: "30% Tax Deducted",
                    amount: -taxAmount,
                });
            }
        }

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocaleStorage();
        updatePieChart();
        incomeText.value = "";
        incomeAmount.value = "";
    }
}

function addExpense(e) {
    e.preventDefault();
    if (expenseText.value.trim() === "" || expenseAmount.value.trim() === "") {
        showNotification();
    } else {
        const transaction = {
            id: generateID(),
            text: expenseText.value,
            amount: -Math.abs(expenseAmount.value),
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocaleStorage();
        updatePieChart();
        expenseText.value = "";
        expenseAmount.value = "";
    }
}

incomeForm.addEventListener("submit", addIncome);
expenseForm.addEventListener("submit", addExpense);






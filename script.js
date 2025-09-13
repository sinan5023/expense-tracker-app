const category = document.getElementById("category");
const amount = document.getElementById("amount");
const totalExpense = document.getElementById("total-amount");
const totalEntries = document.getElementById("total-entries");
const amounterrmsg = document.getElementById("amount-error");
const expenseChart = document.querySelector(".expense-chart");
let categoryerrmsg = document.getElementById("category-error");
const addButton = document.getElementById("add-button");
const listContainer = document.querySelector(".expense-list");
let chartInstance;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
  if (category.value == "" || category.value === null) {
    categoryerrmsg.innerText = "please enter a valid category";
  } else if (
    isNaN(amount.value) != false ||
    amount.value == "" ||
    amount.value == null
  ) {
    categoryerrmsg.innerText = "";
    amounterrmsg.innerText = "please enter a valid amount";
  } else {
    categoryerrmsg.innerText = "";
    amounterrmsg.innerText = "";

    let expense = {
      category: category.value,
      amount: Number(amount.value),
      date: new Date().toLocaleDateString(),
    };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    calculateExpense();
    DisplayChart();
    displaylist();
    // renderChar();
    amount.value = "";
    category.value = "";
  }
}

calculateExpense = () => {
  let total = expenses.reduce((sum, expenses) => sum + expenses.amount, 0);
  totalExpense.textContent = `$${total.toFixed(2)}`;
  totalEntries.textContent = `${expenses.length}`;
};
function DisplayChart() {
  let sumCategory = [];
  expenses.forEach((e) => {
    sumCategory[e.category] = (sumCategory[e.category] || 0) + e.amount;
  });
  let Chartdata = {
    labels: Object.keys(sumCategory),
    datasets: [
      {
        label: "Money Spent",
        data: Object.values(sumCategory),
        backgroundColor: [
          "#7c30dc",
          "#2e50de",
          "#5441dd",
          "#3424adff",
          "#5441e6ff",
          "#166a8f",
        ],
      },
    ],
  };
  if (chartInstance) {
    chartInstance.destroy();
  }
  ctx = document.getElementById("myChart");

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: Chartdata,
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}
displaylist = () => {
  listContainer.innerHTML = "";
  expenses.forEach((expense, index) => {
    const list = document.createElement("div");
    list.innerHTML = ` 
     <div class="expense-item">
            <div class="expense-details">
              <h4>${expense.category}</h4>
              <span>${expense.date}</span>
            </div>
            <div style="display: flex; align-items: center">
              <div class="expense-amount">$${expense.amount}</div>
              <button class="delete-btn">🗑</button>
            </div>
          </div>`;
          const deletebtn = list.querySelector(".delete-btn");
  deletebtn.addEventListener("click", () => {
    deleteExpense(index);
  });
    listContainer.append(list);
  });
  
};
deleteExpense = (index) => {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  calculateExpense();
  DisplayChart();
  displaylist();
};

window.addEventListener("DOMContentLoaded", () => {
  calculateExpense();
  DisplayChart();
  displaylist();
});

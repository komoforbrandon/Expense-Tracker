import myChart from "./chart.js"

const expenseOption =  document.getElementById('options')
const expenseToggle = document.getElementById('expense-cat')
expenseOption.addEventListener('change', (event)=> {
    if (event.target.value === 'expense') {
      expenseToggle.style.display = "block"
    } else {
      expenseToggle.style.display = "none"
    }
})

let totalSalary = document.getElementById('total-amount')
let totalIncome = document.getElementById('income-amount')
let totalExpense = document.getElementById('expense-amount')

const amount = document.getElementById('input-amount')

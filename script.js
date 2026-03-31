import myChart from "./chart.js"

const expenseOption = document.getElementById('options')
const expenseToggle = document.getElementById('expense-cat')
expenseOption.addEventListener('change', (event) => {
  if (event.target.value === 'expense') {
    expenseToggle.style.display = "block"
  } else {
    expenseToggle.style.display = "none"
  }
})

let totalBalance = document.getElementById('total-amount')
let totalIncome = document.getElementById('income-amount')
let totalExpense = document.getElementById('expense-amount')
let cardAmt = document.getElementById('card-amt')
const btn = document.getElementById('trans-btn')

function addAmount() {
  const inputAmt = document.getElementById('input-amount').value
  let date = document.getElementById('date').value
  date = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  const category = document.getElementById('category').value
  const expensetype = document.getElementById('expensecategory').value

  if (expenseOption.value === 'income') {
    const codeBlock = document.createElement('div')
    codeBlock.className = 'add-history-income'
    codeBlock.innerHTML = `
                    <div class="trans-state">
                        <h5 class="icon-income">&#x1F861;</h5>
                        <div class="hist-info">
                            <p class="hist-descrip">${category}</p>
                            <p class="hist-date">${time}, ${date}</p>
                        </div>
                    </div>
                    <div class="amount-btn">
                        <p id="added-amt-income">+&dollar;${inputAmt}</p>
                        <p id="del-btn">&cross;</p>
                    </div>`
    const parentContainer = document.querySelector('.history')
    parentContainer.appendChild(codeBlock)
    totalIncome.textContent = parseFloat(totalIncome.innerText) + parseFloat(inputAmt)
    totalBalance.textContent = parseFloat(totalBalance.innerText) + parseFloat(inputAmt)
    cardAmt.textContent = parseFloat(cardAmt.textContent) + parseFloat(inputAmt)
  } else if (expenseOption.value === 'expense') {
    const codeBlock = document.createElement('div')
    codeBlock.className = 'add-history-expense'
    codeBlock.innerHTML = `
                    <div class="trans-state">
                        <h5 class="icon-expense">&#x1f863;</h5>
                        <div class="hist-info">
                            <p class="hist-descrip">${category}</p>
                            <p class="hist-date">${time}, ${date}</p>
                        </div>
                    </div>
                    <div class="amount-btn">
                        <p id="added-amt-expense">-&dollar;${inputAmt}</p>
                        <p id="del-btn">&cross;</p>
                    </div>`
    const parentContainer = document.querySelector('.history')
    parentContainer.appendChild(codeBlock)
    totalExpense.textContent = parseFloat(totalExpense.innerText) + parseFloat(inputAmt)
    totalBalance.textContent = parseFloat(totalBalance.innerText) - parseFloat(inputAmt)
    cardAmt.textContent = parseFloat(cardAmt.innerText) - parseFloat(inputAmt)
  }
  console.log('Input Amount:', inputAmt)
  console.log('Date:', date)
  console.log('Time:', time)
  console.log('Category:', category)
  console.log('Expense Type:', expensetype)
  console.log('Expense Option:', expenseOption.value)
}

btn.addEventListener('click', () => {
  addAmount()

  form.reset()
})



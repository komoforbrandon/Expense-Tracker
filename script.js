import initializeExpenseChart, { syncExpenseChart } from './chart.js'

const expenseOption = document.getElementById('options')
const expenseToggle = document.getElementById('expense-cat')
const totalBalance = document.getElementById('total-amount')
const totalIncome = document.getElementById('income-amount')
const totalExpense = document.getElementById('expense-amount')
const cardAmt = document.getElementById('card-amt')
const btn = document.getElementById('trans-btn')
const amountInput = document.getElementById('input-amount')
const dateInput = new Date().toISOString().split('T')[0]
const categoryInput = document.getElementById('category')
const expenseCategoryInput = document.getElementById('expensecategory')
const historyContainer = document.querySelector('.history')

const DATE_FORMAT_OPTIONS = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}

const TIME_FORMAT_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}

function parseCurrency (value) {
  return Number.parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
}

function formatCurrency (value) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function toggleExpenseCategory () {
  expenseToggle.style.display =
    expenseOption.value === 'expense' ? 'block' : 'none'

  if (expenseOption.value !== 'expense') {
    clearFieldValidation(expenseCategoryInput)
  }
}

function clearFieldValidation (field) {
  field.setCustomValidity('')
}

function validateTransaction (type, amount, dateValue, category, expenseType) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      isValid: false,
      message: 'Enter a valid amount before adding the transaction.',
      field: amountInput
    }
  }

  if (!category) {
    return {
      isValid: false,
      message: 'Enter a category before adding the transaction.',
      field: categoryInput
    }
  }

  if (type === 'expense' && !expenseType) {
    return {
      isValid: false,
      message: 'Select an expense type before adding an expense.',
      field: expenseCategoryInput
    }
  }

  return { isValid: true }
}

function getTransactionData () {
  const type = expenseOption.value
  const amount = Number.parseFloat(amountInput.value)
  const dateValue = new Date().toISOString().split('T')[0]
  const category = categoryInput.value.trim()
  const expenseType = expenseCategoryInput.value
  const validation = validateTransaction(
    type,
    amount,
    dateValue,
    category,
    expenseType
  )

  if (!validation.isValid) {
    validation.field.setCustomValidity(validation.message)
    validation.field.reportValidity()
    validation.field.focus()
    return null
  }

  return {
    type,
    amount,
    category,
    expenseType,
    date: new Date(`${dateValue}T00:00:00`).toLocaleDateString(
      'en-US',
      DATE_FORMAT_OPTIONS
    ),
    time: new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTIONS)
  }
}

function updateAmountElement (element, nextValue) {
  element.textContent = formatCurrency(nextValue)
}

function updateSummaryTotals (transaction, direction = 1) {
  const currentIncome = parseCurrency(totalIncome.textContent)
  const currentExpense = parseCurrency(totalExpense.textContent)
  const currentBalance = parseCurrency(totalBalance.textContent)
  const currentCardBalance = parseCurrency(cardAmt.textContent)
  const signedAmount = transaction.amount * direction

  if (transaction.type === 'income') {
    updateAmountElement(totalIncome, currentIncome + signedAmount)
    updateAmountElement(totalBalance, currentBalance + signedAmount)
    updateAmountElement(cardAmt, currentCardBalance + signedAmount)
    return
  }

  updateAmountElement(totalExpense, currentExpense + signedAmount)
  updateAmountElement(totalBalance, currentBalance - signedAmount)
  updateAmountElement(cardAmt, currentCardBalance - signedAmount)
}

function createHistoryItem (transaction) {
  const isIncome = transaction.type === 'income'
  const historyItem = document.createElement('div')
  const iconClass = isIncome ? 'icon-income' : 'icon-expense'
  const wrapperClass = isIncome
    ? 'add-history-income'
    : 'add-history-expense'
  const amountClass = isIncome ? 'added-amt-income' : 'added-amt-expense'
  const amountPrefix = isIncome ? '+' : '-'
  const icon = isIncome ? '&#x1F861;' : '&#x1F863;'

  historyItem.className = wrapperClass
  historyItem.dataset.type = transaction.type
  historyItem.dataset.amount = String(transaction.amount)

  if (!isIncome) {
    historyItem.dataset.expenseLabel = transaction.expenseType
  }

  historyItem.innerHTML = `
    <div class="trans-state">
      <h5 class="${iconClass}">${icon}</h5>
      <div class="hist-info">
        <p class="hist-descrip">${transaction.category}</p>
        <p class="hist-date">${transaction.time}, ${transaction.date}</p>
      </div>
    </div>
    <div class="amount-btn">
      <p class="${amountClass}">${amountPrefix} ${formatCurrency(transaction.amount)} CFA</p>
      <p class="del-btn">&cross;</p>
    </div>
  `

  return historyItem
}

function resetTransactionFields () {
  amountInput.value = ''
  dateInput.value = ''
  categoryInput.value = ''
  expenseCategoryInput.value = ''
  clearFieldValidation(amountInput)
  clearFieldValidation(dateInput)
  clearFieldValidation(categoryInput)
  clearFieldValidation(expenseCategoryInput)
  expenseOption.value = 'income'
  toggleExpenseCategory()
}

function getHistoryItems () {
  return Array.from(
    historyContainer.querySelectorAll('.add-history-income, .add-history-expense')
  )
}

function getItemType (historyItem) {
  if (historyItem.dataset.type) {
    return historyItem.dataset.type
  }

  return historyItem.classList.contains('add-history-expense')
    ? 'expense'
    : 'income'
}

function getItemAmount (historyItem) {
  const datasetAmount = Number.parseFloat(historyItem.dataset.amount)

  if (Number.isFinite(datasetAmount) && datasetAmount > 0) {
    return datasetAmount
  }

  const amountElement = historyItem.querySelector(
    '.added-amt-income, .added-amt-expense, #added-amt-income, #added-amt-expense'
  )

  return parseCurrency(amountElement?.textContent ?? '')
}

function getItemExpenseLabel (historyItem) {
  if (historyItem.dataset.expenseLabel) {
    return historyItem.dataset.expenseLabel
  }

  const categoryText =
    historyItem.querySelector('.hist-descrip')?.textContent?.trim().toLowerCase() || ''

  return categoryText
}

function getHistoryTransaction (historyItem) {
  const type = getItemType(historyItem)
  const amount = getItemAmount(historyItem)

  return {
    type,
    amount,
    expenseType: type === 'expense' ? getItemExpenseLabel(historyItem) : ''
  }
}

function initializeHistoryMetadata () {
  getHistoryItems().forEach((historyItem) => {
    const transaction = getHistoryTransaction(historyItem)
    historyItem.dataset.type = transaction.type
    historyItem.dataset.amount = String(transaction.amount)

    if (transaction.type === 'expense' && transaction.expenseType) {
      historyItem.dataset.expenseLabel = transaction.expenseType
    }
  })
}

function buildExpenseChartEntries () {
  return getHistoryItems().reduce((entries, historyItem) => {
    const transaction = getHistoryTransaction(historyItem)

    if (transaction.type !== 'expense' || !transaction.expenseType) {
      return entries
    }

    entries[transaction.expenseType] =
      (entries[transaction.expenseType] || 0) + transaction.amount

    return entries
  }, {})
}

function refreshChartFromHistory () {
  syncExpenseChart(buildExpenseChartEntries())
}

function addAmount () {
  const transaction = getTransactionData()

  if (!transaction) {
    return
  }

  historyContainer.appendChild(createHistoryItem(transaction))
  updateSummaryTotals(transaction)
  refreshChartFromHistory()
  resetTransactionFields()
}

function deleteTransaction (deleteButton) {
  const historyItem = deleteButton.closest(
    '.add-history-income, .add-history-expense'
  )

  if (!historyItem) {
    return
  }

  const transaction = getHistoryTransaction(historyItem)
  historyItem.remove()
  updateSummaryTotals(transaction, -1)
  refreshChartFromHistory()
}

expenseOption.addEventListener('change', toggleExpenseCategory)
amountInput.addEventListener('input', () => clearFieldValidation(amountInput))
categoryInput.addEventListener('input', () => clearFieldValidation(categoryInput))
expenseCategoryInput.addEventListener('change', () =>
  clearFieldValidation(expenseCategoryInput)
)
btn.addEventListener('click', (event) => {
  event.preventDefault()
  addAmount()
})
historyContainer.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.del-btn, #del-btn')

  if (!deleteButton) {
    return
  }

  deleteTransaction(deleteButton)
})

toggleExpenseCategory()
initializeHistoryMetadata()
initializeExpenseChart()
refreshChartFromHistory()

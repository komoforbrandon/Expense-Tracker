const chartColors = [
  '#ff9f1c',
  '#2ec4b6',
  '#e71d36',
  '#6a4c93',
  '#4cc9f0',
  '#8ac926'
]

const expenseTotals = new Map()
let expenseChart

function formatExpenseLabel (label) {
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function normalizeExpenseEntries (entries) {
  if (!entries) {
    return []
  }

  if (Array.isArray(entries)) {
    return entries
  }

  return Object.entries(entries)
}

function getChartData () {
  const labels = Array.from(expenseTotals.keys()).map(formatExpenseLabel)
  const data = Array.from(expenseTotals.values())

  return {
    labels,
    datasets: [
      {
        data,
        label: 'Expense ($)',
        backgroundColor: chartColors.slice(0, Math.max(labels.length, 1)),
        borderColor: '#2c2b2b',
        borderWidth: 2
      }
    ]
  }
}

export default function initializeExpenseChart () {
  if (expenseChart) {
    return expenseChart
  }

  const ctx = document.getElementById('my-chart')
  const ChartConstructor = globalThis.Chart

  if (!ctx || !ChartConstructor) {
    return null
  }

  expenseChart = new ChartConstructor(ctx, {
    type: 'doughnut',
    data: getChartData(),
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  })

  return expenseChart
}

function refreshExpenseChart () {
  const chartInstance = initializeExpenseChart()

  if (!chartInstance) {
    return
  }

  chartInstance.data = getChartData()
  chartInstance.update()
}

export function syncExpenseChart (entries) {
  expenseTotals.clear()

  normalizeExpenseEntries(entries).forEach(([label, amount]) => {
    const normalizedLabel = String(label).trim().toLowerCase()
    const normalizedAmount = Number(amount)

    if (!normalizedLabel || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return
    }

    expenseTotals.set(normalizedLabel, normalizedAmount)
  })

  refreshExpenseChart()
}

export function addExpenseToChart (label, amount) {
  if (!label || !Number.isFinite(amount) || amount <= 0) {
    return
  }

  const normalizedLabel = label.trim().toLowerCase()
  const currentAmount = expenseTotals.get(normalizedLabel) || 0
  expenseTotals.set(normalizedLabel, currentAmount + amount)
  refreshExpenseChart()
}

initializeExpenseChart()

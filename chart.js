export default function myChart(){
    const data = { 
    labels: ['Food',2,3,4,5,6],
    datasets:[{
        data: [203,384,199,234,463,500],
        label: 'Expense($)'
    }]
  }

  const ctx = document.getElementById('my-chart')
  const myChart = new Chart(
    ctx,
    {
        type: 'doughnut',
        data
    }
  )
}

myChart()
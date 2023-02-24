import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Percent } from 'react-bootstrap-icons'
import { Load } from './Load'
import { color_1, color_2 } from '../constants'

ChartJS.register(ArcElement, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false
    },
    tooltip: {
      bodyFont: {
        size: 18
      },
      titleFont: {
        size: 18
      },
      padding: 4,
      callbacks: {
        label: function (context) {
          let total = 0
          context.dataset.data.forEach((amt) => {
            total += amt
          })
          const money = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })
          return ` ${money.format(context.raw)} (${Math.round((context.raw / total) * 100)}%) `
        }
      }
    }
  }
}

export default function DoughnutChart({ data }) {
  const [clickedElement, setClickedElement] = useState('')
  const [chartData, setChartData] = useState()

  useEffect(() => {
    if (data) genChart()
  }, [data])

  if (!chartData) return <Load />

  function genChart() {
    if (data.length == 0) return
    
    const labels = data.map(obj => obj.alias)
    const doughnutData = data.map(obj => obj.total)

    setChartData({
      labels: labels, 
      datasets: [
        {
          label: '% provided',
          data: doughnutData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(100, 51, 204, 0.2)',
            'rgba(180, 51, 204, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(100, 51, 204, 1)',
            'rgba(180, 51, 204, 1)',
          ],
          borderWidth: 1,
        },
      ],
    })
  }

  return (
    <>
      <h1 className=" text-center" style={{fontWeight: '1'}}><Percent className="ml-2 mb-2" size={30}/> Given</h1>
      <Doughnut data={chartData} options={options} />
    </>
  )
}

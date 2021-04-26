import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Percent } from 'react-bootstrap-icons'

export default function DoughnutChart({ data }) {
  const [clickedElement, setClickedElement] = useState('')
  const [chartData, setChartData] = useState()

  useEffect(() => {
    if (data) genChart()
  }, [data])

  function getElementAtEvent(element) {
    if (!element.length || !chartData) return
    setClickedElement(chartData.labels[element[0].index])
  }

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
      <h1 className="display-4 text-center"><Percent className="ml-2 mb-2" size={30}/> Given</h1>
      <Doughnut 
        data={chartData}
        getElementAtEvent={getElementAtEvent}
      />
    </>
  )
}

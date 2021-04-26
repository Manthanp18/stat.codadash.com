import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Bar } from 'react-chartjs-2'

const rand = () => Math.floor(Math.random() * 255)

// used https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Crazy.js as template
export default function Bars({ data, screen }) {
  const [clickedElement, setClickedElement] = useState('')
  const [chartData, setChartData] = useState()
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (data) genChart()
  }, [data, screen, year])

  function getElementAtEvent(element) {
    if (!element.length || !chartData) return
    setClickedElement(chartData.labels[element[0].index])
  }

  function genChart() {
    if (data.length == 0) return
    const aliases = [...new Set(data.map(e => e.alias))]
    const months = Array.from({length: 12}, (v, i) => (i + 1))

    const barData = aliases.map(alias => (
      months.map(month => {
        let total = 0
        data.forEach(doc => {
          if (doc.alias === alias && doc.month === month && doc.year === year) total = doc.total
        })
        return total
      })
    ))

    let xLabels = []
    if (screen.includes('small')) xLabels = months
    if (!screen.includes('small')) xLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const dataSets = aliases.map((alias, index) => ({
        type: 'bar',
        label: aliases[index],
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: barData[index],
      }
    )) || []

    setChartData({
      labels: xLabels,
      datasets: dataSets,
    })
  }

  function handleYear(e) {
    if (Number(e.target.value) !== year) {
      setYear(Number(e.target.value))
    }
  }

  function genYearOptions() {
    let startYear = 2021
    let endYear = startYear
    const optionsArr = []
    data.forEach(doc => {
      if (doc.year < startYear) startYear = doc.year
      if (doc.year > endYear) endYear = doc.year
    })
    for (let i = startYear; i <= endYear; i++) {             
      optionsArr.push(<option key={i} value={i}>{i}</option>)
    }
    return optionsArr
  }

  return (
    <>
      <Row>
        <Col md={9}>
          <h1 className="display-4">Bars Chart</h1>
        </Col>
        <Col md={3}>
          <Form className="pt-2">
            <Form.Group controlId="year">
              <Form.Control as="select" size="sm" custom value={year} onChange={handleYear}>
                {genYearOptions()}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Bar 
        data={chartData}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
        getElementAtEvent={getElementAtEvent}
      />
    </>
  )
}
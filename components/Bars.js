import { useEffect, useState, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Load } from './Load'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// example options
// const options = {
// }

// TODO: this should be set somewhere else
const rand = () => Math.floor(Math.random() * 255)

// used https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Crazy.js as template
export default function Bars({ data, screen }) {
  const [chartData, setChartData] = useState()
  const [year, setYear] = useState(new Date().getFullYear())
  const [yearOptions, setYearOptions] = useState([])
  const yearSelect = useRef(null)

  useEffect(() => {
    if (data) genChart()
  }, [data, screen, year])

  useEffect(() => {
    if (yearSelect) {
      if (yearSelect.current) {
        yearSelect.current.value = year
      }
    }
  }, [yearOptions, year])

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  if (!chartData) return <Load />

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

    const allYears = []
    data.forEach(doc => {
      if (!allYears.includes(doc.year)) {
        allYears.push(doc.year)
      }
    })
    
    setYearOptions(allYears)
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

  return (
    <>
      <Row>
        <Col md={9}>
          <h4 className="">Month View</h4>
        </Col>
        <Col md={3}>
          <Form.Select className="pt-2 d-inline" style={{maxWidth: '120px'}} onChange={handleYear} ref={yearSelect}>
            {yearOptions.length > 0 && yearOptions.map(y => (
              <option value={y} key={y}>{y}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Bar 
        data={chartData}
      />
    </>
  )
}
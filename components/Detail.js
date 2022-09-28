import { useState, useEffect } from 'react'
import LineChart from './Line'

const rand = () => Math.floor(Math.random() * 255)
let labels = []

export default function Detail({ data, getData, session, screen}) {
  const [datasets, setDataSets] = useState()
  const [categories, setCategories] = useState(['Water', 'Energy', 'Internet']) // mortgage removed

  useEffect(() =>  {
    if (data && categories) getChartData(data?.raw)
  }, [data, categories])
  
  function getChartData(d) {
    if (!d) return

    const datasets = []
    const months = Array.from({length: 12}, (v, i) => (i + 1))

    if (screen.includes('small')) labels = months
    if (!screen.includes('small')) labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    categories.forEach(category => {
      const monthlyData = months.map(month => {
        let total = 0
        d.forEach(doc => {
          if (new Date(doc.createdAt).getMonth() + 1 === month && new Date(doc.createdAt).getFullYear() === new Date().getFullYear()) {
            if (doc.description.toLowerCase().includes(category.toLowerCase())) {
              total += doc.amount
            }
          }
        })
        if (total === 0) return null
        return total
      })
      let randArr = [rand(), rand(), rand()]
      datasets.push({
        label: category,
        borderColor: `rgb(${randArr[0]}, ${randArr[1]}, ${randArr[2]})`,
        backgroundColor: `rgba(${randArr[0]}, ${randArr[1]}, ${randArr[2]}, 0.2)`,
        data: monthlyData,
      })
    })
    setDataSets(datasets)
  }

  return (
    <LineChart labels={labels} datasets={datasets} />
  )
}

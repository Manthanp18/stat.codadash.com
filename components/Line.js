import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Load } from './Load'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function LineChart({ datasets, labels }) {

  if (!datasets) return (<Load />)

  return (
    <Line 
      options={{
        scales: {
          y: {
            beginAtZero: true
          }
        },
        datasets: {
          line: {
            borderWidth: 8,
            tension: .3
          }
        }
      }} 
      data={{
        labels,
        datasets
      }} 
    />
  )
}
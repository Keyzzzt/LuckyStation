import { FC, useEffect, useRef } from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
// import styles from './ChartContainer.module.css'
import { Chart, registerables } from 'chart.js'
import { addData } from '../../../../04_Utils/utils'
import { useHistory } from 'react-router'
import { useIsAdminRedirect } from '../../../../04_Utils/hooks'

Chart.register(...registerables)
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const data = {
  labels,
  datasets: [
    {
      label: 'Sales',
      backgroundColor: 'rgba(51, 200, 99, 0.1)',
      fill: true,
      borderColor: '#33c863',
      data: addData(12),
      tension: 0.2,
    },
    {
      label: 'Profit',
      backgroundColor: 'rgba(242, 153, 74, 0.1)',
      fill: true,
      borderColor: '#f2994a',
      data: addData(12),
      tension: 0.2,
    },
  ],
}

export const ChartContainer: FC = () => {
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  useIsAdminRedirect(userInfo, history)

  const { config } = useTypedSelector((state) => state)
  const chartRef = useRef()
  // const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    const canvasId = document.getElementById('myCanvas')
    // @ts-ignore
    chartRef.current = new Chart(canvasId, {
      type: 'line',
      data,
      options: {
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x',
        },
        plugins: {
          tooltip: {
            enabled: true,
          },
          legend: false,
        },
        scales: {
          y: {
            display: false,
          },
          x: {
            grid: {
              drawBorder: false,
              borderDash: [6],
              color: config.colorTheme === 'light' ? '#dddfe5' : '#26323f',
              border: false,
            },
            ticks: {
              color: config.colorTheme === 'light' ? '#929292' : '#fff',
              font: {
                family: "'Roboto', sans-serif",
                size: '16px',
              },
            },
          },
        },
      },
    })
    //@ts-ignore
    return () => chartRef.current.destroy()
  }, [config.colorTheme])

  return <canvas id="myCanvas"></canvas>
}

import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTheme } from '@material-ui/core/styles'
import firebase from 'config.js'

const ComparisonChart2 = ({ height }) => {
  const { palette } = useTheme()
  const [chartData, setChartData] = useState([])

  function formatDate(timestamp) {
    const date = timestamp.toDate();
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  }

  useEffect(() => {
    firebase.firestore().collection('stats').doc('revenue_array').get().then((snap) => {
      const chartObj = snap.data()
      const chartArr = Object.values(chartObj).map(a => [formatDate(a[0]), a[1], a[2]]).sort((a, b) => a[0] > b[0] ? 1 : -1)
      setChartData([['Date', 'Calls', 'Revenue'], ...chartArr])
    })
  }, [])

  const option = {
    grid: {
      left: '12%',
      bottom: '10%',
      right: '1%',
    },
    legend: {
      itemGap: 20,
      icon: 'circle',
      textStyle: {
        color: palette.text.secondary,
        fontSize: 13,
        fontFamily: 'roboto',
      },
    },
    color: [
      palette.primary.dark,
      palette.secondary.light,
    ],
    barMaxWidth: '10px',
    tooltip: {},
    dataset: {
      source: chartData,
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: palette.text.secondary,
        fontSize: 13,
        fontFamily: 'roboto',
      },
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        // show: false
        lineStyle: {
          color: palette.text.secondary,
          opacity: 0.15,
        },
      },
      axisLabel: {
        color: palette.text.secondary,
        fontSize: 13,
        fontFamily: 'roboto',
      },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: 'bar',
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0],
        },
      },
      {
        type: 'bar',
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0],
        },
      },
    ],
  }

  return <ReactEcharts style={{ height: height }} option={option} />
}

export default ComparisonChart2

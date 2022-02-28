import React, { useState, useEffect } from 'react'
import { Grid, Card, Icon } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'config.js'

const useStyles = makeStyles(({ palette, ...theme }) => ({
  icon: {
    fontSize: '44px',
    opacity: 0.6,
    color: palette.primary.main,
  },
}))

const StatCards = () => {
  const classes = useStyles()
  const [userCount, setUserCount] = useState('')
  const [panditCount, setPanditCount] = useState('')
  const [todayRevenue, setTodayRevenue] = useState('')
  const [monthRevenue, setMonthRevenue] = useState('')

  useEffect(() => {

        firebase
        .firestore()
        .collection("users")
        .orderBy('createdAt', "desc").get().then(snap =>  setUserCount(snap.size));

        firebase
        .firestore()
        .collection("pandits")
        .orderBy('createdAt', "desc").get().then(snap =>  setPanditCount(snap.size))

    firebase.firestore().collection('stats').get().then(stats => {
      stats.docs.forEach(stat => {
        if (stat.id === 'daily_revenue') {
          setTodayRevenue(stat.data().value)
        }
        else if (stat.id === 'monthly_revenue') {
          setMonthRevenue(stat.data().value)
        }
      })
    })
  }, [])

  return (
    <Grid container spacing={3} className="mb-3">
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={classes.icon}>group</Icon>
            <div className="ml-3">
              <small className="text-muted">Total Users</small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {userCount}
              </h6>
            </div>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={classes.icon}>person</Icon>
            <div className="ml-3">
              <small className="text-muted">
                Total Active Pandits
              </small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {panditCount}
              </h6>
            </div>
          </div>
        </Card>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between align-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={`fas fa-rupee-sign ${classes.icon}`} />
            <div className="ml-3">
              <small className="text-muted line-height-1">
                Today's Revenue
              </small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {todayRevenue}
              </h6>
            </div>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={`fas fa-rupee-sign ${classes.icon}`} />
            <div className="ml-3">
              <small className="text-muted">
                Monthly Revenue
              </small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {monthRevenue}
              </h6>
            </div>
          </div>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default StatCards

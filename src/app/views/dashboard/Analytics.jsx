import React, { Fragment } from 'react'
import { Grid, Card } from '@material-ui/core'
import ComparisionChart from './ComparisonChart'
import StatCards from './StatCards'
import RecentCallsTable from './RecentCallsTable'

const Analytics = () => {

  return (
    <Fragment>
      <div className="analytics m-sm-30 mt-6">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards />

            <RecentCallsTable />

          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card className="px-6 py-4 mb-6">
              <div className="card-title">Calls vs Revenue</div>
              <div className="card-subtitle">Last 7 days</div>
              <ComparisionChart
                height="300px"
              />
            </Card>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  )
}

export default Analytics

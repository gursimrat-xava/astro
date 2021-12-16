import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import firebase from 'config.js'

const useStyles = makeStyles(({ palette, ...theme }) => ({
  productTable: {
    '& small': {
      height: 15,
      width: 50,
      borderRadius: 500,
      boxShadow:
        '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    },
    '& td': {
      borderBottom: 'none',
    },
    '& td:first-child': {
      paddingLeft: '16px !important',
    },
  },
}))

const RecentCallsTable = () => {
  const [callList, setCallList] = useState([])
  const classes = useStyles()

  useEffect(() => {
    firebase.firestore().collection('calls').onSnapshot((calls) => {
      setCallList([])
      calls.forEach((call) => {
        const callData = call.data()
        const duration = callData.endTime - callData.startTime
        callData.duration = `${duration<60 ? '' : duration/60+'m'} ${duration%60}s`

        Promise.all([callData.caller.get(), callData.receiver.get()])
        .then(([callerData, receiverData]) => {
          callData.caller = callerData.data()
          callData.receiver = receiverData.data()
  
          setCallList(prevList => [...prevList, callData])
        })
        .catch(e => console.log('error fetching call list', e))
      })
    })
  }, [])

  return (
    <Card elevation={3} className="pt-5 mb-6">
      <div className="px-6 mb-3">
        <span className="card-title">Recent Calls</span>
      </div>
      <div className="overflow-auto">
        <Table
          className={clsx(
            'whitespace-pre min-w-400',
            classes.productTable
          )}
        >
          <TableHead>
            <TableRow>
              <TableCell className="px-6">
                User
              </TableCell>
              <TableCell className="px-0">
                Pandit
              </TableCell>
              <TableCell className="px-0" align="center">
                Duration
              </TableCell>
              <TableCell className="px-0" align="center">
                Credits Spent
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {callList
              .map((call, index) => (
                <TableRow key={index}>
                  <TableCell
                    className="px-6 capitalize"
                    align="left"
                  >
                    {call.caller.firstName}
                  </TableCell>
                  <TableCell
                    className="px-0 capitalize"
                    align="left"
                  >
                    {call.receiver.name}
                  </TableCell>
                  <TableCell
                    className="px-0 capitalize"
                    align="center"
                  >
                    {call.duration}
                  </TableCell>
                  <TableCell
                    className="px-0 capitalize"
                    align="center"
                  >
                    {call.credits}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default RecentCallsTable

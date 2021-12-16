import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { classList } from 'utils'
import {
  Card,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
} from '@material-ui/core'
import Add from './editFinance.jsx'

const List = () => {
  const [openEdit, setOpenEdit] = useState(null)
  const [userList, setUserList] = useState([])

  useEffect(() => {
    firebase.firestore().collection('finances').onSnapshot((users) => {
      const data = []
      users.forEach((user) => {
        data.push(user.data())
      })
      setUserList(data);
    })
  }, [])

  const handleEdit = (user) => {
    setOpenEdit(user);
  }

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Finance', path: '/finance' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="flex justify-between items-center">
          <div
            className={classList({
              'card-title': true,
              'mb-4': true,
            })}
          >
            Finances
          </div>
        </div>
        <div className="w-full overflow-auto">
          <Table className="whitespace-pre">
            <TableHead>
              <TableRow>
                <TableCell className="px-0">Finance</TableCell>
                <TableCell className="px-0">Value</TableCell>
                <TableCell align="center" className="px-0">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      <div className="flex justify-start items-center">
                        <span className="text-16 ml-2">{user.key}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {user.value}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      <IconButton onClick={() => handleEdit(user)}>
                        <Icon color="secondary">edit</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      {
        openEdit && <Add open={openEdit != null} setOpen={setOpenEdit} edit editUser={openEdit} />
      }
    </div>
  )
}

export default List

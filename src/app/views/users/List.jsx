import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { classList } from 'utils'
import {
  Avatar,
  Card,
  Button,
  IconButton,
  Switch,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  TablePagination,
} from '@material-ui/core'
import Add from './Add'

const List = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(null)
  const [userList, setUserList] = useState([])

  useEffect(() => {
    firebase.firestore().collection('users').onSnapshot((users) => {
      const data = []
      users.forEach((user) => {
        data.push(user.data())
      })
      setUserList(data);
    })
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleEdit = (user) => {
    setOpenEdit(user);
  }

  const handleChange = (user, selected) => {
    // change active status of userselected
    firebase.firestore().collection('users').doc(user.uid).set({ active: selected }, { merge: true });
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Users' },
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
            All Users
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenAdd(true)}
          >
            + Add User
          </Button>
        </div>
        <div className="w-full overflow-auto">
          <Table className="whitespace-pre">
            <TableHead>
              <TableRow>
                <TableCell className="px-0">Name</TableCell>
                <TableCell className="px-0">UID</TableCell>
                <TableCell className="px-0" align="center">Languages</TableCell>
                <TableCell className="px-0" align="center">Credits</TableCell>
                <TableCell className="px-0" align="center">Active</TableCell>
                <TableCell className="px-0" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      <div className="flex justify-start items-center">
                        {
                          user.pic ?
                            <Avatar alt={user.firstName} src={user.pic} />
                            :
                            <Avatar>{user.firstName[0].toUpperCase()}</Avatar>
                        }
                        <span className="text-16 font-bold ml-2">{user.firstName}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {user.uid}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {user.languages && user.languages.join(', ')}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {user.credits}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      <Switch
                        checked={user.active}
                        onChange={(e) => handleChange(user, e.target.checked)}
                        color="primary"
                        name="active"
                      />
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      <IconButton onClick={() => handleEdit(user)}>
                        <Icon color="secondary">edit</Icon>
                      </IconButton>
                      {/* <IconButton>
                        <Icon color="error">close</Icon>
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            className="px-4"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </Card>
      {
        openAdd && <Add open={openAdd} setOpen={setOpenAdd} />
      }
      {
        openEdit && <Add open={openEdit != null} setOpen={setOpenEdit} edit editUser={openEdit} />
      }
    </div>
  )
}

export default List

import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { classList } from 'utils'
import { useHistory } from 'react-router-dom';
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
  const [panditList, setPanditList] = useState([])
  const history = useHistory();

  useEffect(() => {
    firebase.firestore().collection('pandits').onSnapshot((pandits) => {
      const data = []
      pandits.forEach((pandit) => {
        data.push(pandit.data())
      })
      data.sort((a, b) => {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();
        return aName > bName ? 1 : aName < bName ? -1 : 0
      })
      setPanditList(data);
    })
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const callHistory = (panditid) => {
      history.push("call_history?panditid="+panditid);
  }

  const handleEdit = (pandit) => {
    setOpenEdit(pandit);
  }

  const handleChange = (pandit, selected) => {
    // change active status of panditselected
    firebase.firestore().collection('pandits').doc(pandit.uid).set({ active: selected }, { merge: true });
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Pandits' },
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
            All Pandits
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenAdd(true)}
          >
            + Add Pandit
          </Button>
        </div>
        <div className="w-full overflow-auto">
          <Table className="whitespace-pre">
            <TableHead>
              <TableRow>
                <TableCell className="px-0">Name</TableCell>
                <TableCell className="px-0">UID</TableCell>
                <TableCell className="px-0" align="center">Languages</TableCell>
                <TableCell className="px-0" align="center">Hours Worked</TableCell>
                <TableCell className="px-0" align="center">Active</TableCell>
                <TableCell className="px-0" align="center">Balance Consumed</TableCell>
                <TableCell className="px-0" align="center">Minutes Consumed</TableCell>
                <TableCell className="px-0" align="center">Chats Replied</TableCell>
                <TableCell className="px-0" align="center">Actions</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {panditList
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((pandit, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      <div className="flex justify-start items-center">
                        {
                          pandit.pic ?
                            <Avatar alt={pandit.name} src={pandit.pic} />
                            :
                            <Avatar>{pandit.name[0].toUpperCase()}</Avatar>
                        }
                        <span className="text-16 font-bold ml-2" onClick={() => callHistory(pandit.uid)}>{pandit.name}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {pandit.uid}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {pandit.languages && pandit.languages.join(', ')}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {pandit.hours}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      <Switch
                        checked={pandit.active}
                        onChange={(e) => handleChange(pandit, e.target.checked)}
                        color="primary"
                        name="active"
                      />
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {pandit.balanceConsumed}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {pandit.minutesConsumed}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {pandit.chatsReplied}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      <IconButton onClick={() => handleEdit(pandit)}>
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
            count={panditList.length}
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
        openEdit && <Add open={openEdit != null} setOpen={setOpenEdit} edit editPandit={openEdit} />
      }
    </div>
  )
}

export default List

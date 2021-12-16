import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { useHistory } from 'react-router-dom';
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

const History = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(null)
  const [callList, setCallList] = useState([])

  useEffect(() => {


    firebase.firestore().collection("pandits").doc((new URLSearchParams(window.location.search)).get("panditid")).collection("calls").get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(queryDocumentSnapshot => {
        data.push(queryDocumentSnapshot.data())
      });
      setCallList(data);
    })
    .catch(err => {
      alert(err);
    });
    
  }, [])



  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
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
            { name: 'Call History' },
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
            All Calls
          </div>
          
        </div>
        <div className="w-full overflow-auto">
        {callList.length ? 
        <div>
          <Table className="whitespace-pre">
            <TableHead>
              <TableRow>
                <TableCell className="px-0">User</TableCell>
                <TableCell className="px-0">Minutes</TableCell>
                <TableCell className="px-0">Seconds</TableCell>
                <TableCell className="px-0">Reciever</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {callList
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((call, index) => (
                  <TableRow key={index}>
                   
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {call.callername}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {call.minutes}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {call.seconds}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {call.recievername}
                    </TableCell>
                    
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            className="px-4"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={callList.length}
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
          : <p>No call records found for now!</p>}
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

export default History

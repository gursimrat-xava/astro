import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { classList } from 'utils'
import {
  Card,
  Button,
  Switch,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '@material-ui/core'
import Add from './Add'

const List = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [openAdd, setOpenAdd] = useState(false)
  const [couponList, setCouponList] = useState([])

  useEffect(() => {
    firebase.firestore().collection('coupons').onSnapshot((pandits) => {
      const data = []
      pandits.forEach((coupon) => {
        const temp = coupon.data()
        temp.uid = coupon.id
        data.push(temp)
      })
      data.sort((a, b) => {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();
        return aName > bName ? 1 : aName < bName ? -1 : 0
      })
      setCouponList(data);
    })
  }, [])

  const handleChange = (coupon, selected) => {
    firebase.firestore().collection('coupons').doc(coupon.uid).set({ active: selected }, { merge: true });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Coupons', path: '/coupons' },
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
            All Coupons
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenAdd(true)}
          >
            + Add Coupon
          </Button>
        </div>
        <div className="w-full overflow-auto">
          <Table className="whitespace-pre">
            <TableHead>
              <TableRow>
                <TableCell className="px-0">Name</TableCell>
                <TableCell className="px-0" align="center">Value</TableCell>
                <TableCell className="px-0" align="center">Max use</TableCell>
                <TableCell className="px-0" align="center">Times used</TableCell>
                <TableCell className="px-0" align="center">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {couponList
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((coupon, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-0 capitalize"
                      align="left"
                    >
                      {coupon.name}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {coupon.value}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {coupon.maxUse}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      {coupon.timesUsed}
                    </TableCell>
                    <TableCell
                      className="px-0 capitalize"
                      align="center"
                    >
                      <Switch
                        checked={coupon.active}
                        onChange={(e) => handleChange(coupon, e.target.checked)}
                        color="primary"
                        name="active"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            className="px-4"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={couponList.length}
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
    </div>
  )
}

export default List

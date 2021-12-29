import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
//import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Card,
  IconButton,
  Switch,
  Icon,
} from '@material-ui/core'
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import Add from './Add'

const List = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(null)
  const [vendorList, setVendorList] = useState([])
  //const history = useHistory();

  useEffect(() => {
    firebase.firestore().collection('vendors').orderBy('createdAt','desc').onSnapshot((vendors) => {
      const data = []
      vendors.forEach((vendor) => {
        // data.push(vendor.data())
        const tempData = vendor.data();
        console.log(tempData);
        tempData.createdAt= tempData.createdAt.toDate();
        tempData.createdAt= tempData.createdAt.toLocaleString('en-US');
        tempData.active = tempData.active ? 'Active' : 'Inactive';
        data.push(tempData)
      })
      
      setVendorList(data);
    })
  }, [])

  const handleEdit = (vendor) => {
    setOpenEdit(vendor);
  }

  const handleChange = (vendor, selected) => {
    // change active status of panditselected
    firebase.firestore().collection('vendors').doc(vendor.uid).set({ active: selected }, { merge: true });
  };

  const columns = [
    {
      name: "Company",
      label: "Company",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const vendor = vendorList[dataIndex];
          return (
            <div className="flex justify-start items-center">

              {
                vendor.pic ?
                  <Avatar alt={vendor.companyName} src={vendor.pic} />
                  :
                  <Avatar>{vendor.companyName[0].toUpperCase()}</Avatar>
              }
                          <span className="text-16 font-bold ml-2">{vendor.companyName}</span>
            </div>
          )
        },
        customFilterListOptions: {
          render: v => `Company: ${v}`
        },
        filter: true,
        filterType: 'textField',
        sort: true,
      }
    },
    {
        name: "username",
        label: "username",
        options: {
            customFilterListOptions: {
              render: v => `username: ${v}`
            },
            filter: true,
            filterType: 'textField',
          }
        
      },
    {
      name: "uid",
      label: "UID",
      options: {
        customFilterListOptions: {
          render: v => `UID: ${v}`
        },
        filter: true,
        filterType: 'textField',
      }
    },
    {
      name: "createdAt",
      label: "createdAt",
      options: {
        customFilterListOptions: {
          render: v => `createdAt: ${v}`
        },
        filter: false,
        sort: true,
        filterType: 'textField',
      }
    },
    {
      name: "active",
      label: "Activity Status",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const vendor = vendorList[dataIndex];
          return (
            <Switch
              checked={vendor.active === 'Active'}
              onChange={(e) => handleChange(vendor, e.target.checked)}
              color="primary"
              name="active"
            />
          )
        },
        customFilterListOptions: {
          render: v => `Activity Status: ${v}`
        },
        filter: true,
        filterType: 'checkbox',
        sort: false,
      }
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const vendor = vendorList[dataIndex];
          return (
            <>
              <IconButton onClick={() => handleEdit(vendor)}>
                <Icon color="secondary">edit</Icon>
              </IconButton>
              {/* <IconButton>
              <Icon color="error">close</Icon>
              </IconButton> */}
            </>
          )
        },
        filter: false,
        searchable: false,
        sort: false,
      }
    },
  ];

  const options = {
    print: false,
    rowsPerPageOptions: [10, 15, 20],
    selectableRows: 'none',
    downloadOptions: {
      filename: 'vendorList.csv',
      separator: ',',
      filterOptions: {
        useDisplayedRowsOnly: true
      }
    },
    customToolbar: () => {
      return (
        <Tooltip title={"Add "}>
          <IconButton onClick={() => setOpenAdd(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      );
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Vendors' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
          <MUIDataTable
              title={"All Vendors"}
              data={vendorList}
              columns={columns}
              options={options}
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

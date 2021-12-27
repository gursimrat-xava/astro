import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import {
  Avatar,
  Card,
  FormLabel,
  FormGroup,
  TextField,
  IconButton,
  Switch,
  Icon,
} from '@material-ui/core'
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import Add from './Add'
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

const List = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(null)
  const [userList, setUserList] = useState([])

  useEffect(() => {
    firebase.firestore().collection('users').orderBy('createdAt', 'desc').onSnapshot((users) => {
      const data = []
      users.forEach((user) => {
        const tempData = user.data();
        tempData.createdAt = new Date(tempData.createdAt.seconds * 1000);
        tempData.active = tempData.active ? 'Active' : 'Inactive';
        data.push(tempData)
      })
      setUserList(data);
    })
  }, [])

  const handleEdit = (user) => {
    setOpenEdit(user);
  }

  const handleChange = (user, selected) => {
    // change active status of userselected
    firebase.firestore().collection('users').doc(user.uid).set({ active: selected }, { merge: true });
  };

  const columns = [
    {
      name: "firstName",
      label: "Name",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const user = userList[dataIndex];
          return (
            <div className="flex justify-start items-center">
              {
                user.pic ?
                  <Avatar alt={user.firstName} src={user.pic} />
                  :
                  <Avatar>{user.firstName[0].toUpperCase()}</Avatar>
              }
              <span className="text-16 font-bold ml-2">{user.firstName}</span>
            </div>
          )
        },
        customFilterListOptions: {
          render: v => `Name: ${v}`
        },
        filter: true,
        filterType: 'textField',
        sort: true,
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
      label: "Created At",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const createdAt = userList[dataIndex].createdAt
          return `${createdAt.toDateString()} ${createdAt.getHours()}:${createdAt.getMinutes()}`;
        },
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Created At: ${v[0].toDateString()} ${v[0].getHours()}:${v[0].getMinutes()}, Max Created At: ${v[1].toDateString()} ${v[1].getHours()}:${v[1].getMinutes()}`;
            } else if (v[0]) {
              return `Min Created At: ${v[0].toDateString()} ${v[0].getHours()}:${v[0].getMinutes()}`;
            } else if (v[1]) {
              return `Max Created At: ${v[1].toDateString()} ${v[1].getHours()}:${v[1].getMinutes()}`;
            }
            return [];
          },
          update: (filterList, filterPos, index) => {
            if (filterPos === 0) {
              filterList[index].splice(filterPos, 1, '');
            } else if (filterPos === 1) {
              filterList[index].splice(filterPos, 1);
            } else if (filterPos === -1) {
              filterList[index] = [];
            }
            return filterList;
          },
        },
        filterOptions: {
          names: [],
          logic(startTime, filters) {
            console.log(startTime, filters)
            if (filters[0] && filters[1]) {
              return startTime <= filters[0] || startTime >= filters[1];
            } else if (filters[0]) {
              return startTime <= filters[0];
            } else if (filters[1]) {
              return startTime >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Start Date Time</FormLabel>
              <FormGroup row>
                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                >
                  <KeyboardDateTimePicker
                    style={{ width: '45%', marginRight: '5%' }}
                    margin="dense"
                    label="min"
                    type="text"
                    size="small"
                    autoOk={true}
                    value={filterList[index][0] || null}
                    format="MMM dd, yyyy HH:mm"
                    onChange={date => {
                      filterList[index][0] = date;
                      onChange(filterList[index], index, column);
                    }}
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                >
                  <KeyboardDateTimePicker
                    style={{ width: '45%', marginRight: '5%' }}
                    margin="dense"
                    label="max"
                    type="text"
                    size="small"
                    autoOk={true}
                    value={filterList[index][1] || null}
                    format="MMM dd, yyyy HH:mm"
                    onChange={date => {
                      filterList[index][1] = date;
                      onChange(filterList[index], index, column);
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormGroup>
            </div>
          ),
        },
        searchable: false,
        sort: true,
      }
    },
    {
      name: "languages",
      label: "Languages",
      options: {
        // {user.languages && user.languages.join(', ')}
        customBodyRenderLite: (dataIndex) => {
          const user = userList[dataIndex];
          return user.languages && user.languages.join(', ');
        },
        customFilterListOptions: {
          render: v => `Languages: ${v}`
        },
        filter: true,
        filterType: 'multiselect',
        sort: false,
      }
    },
    {
      name: "credits",
      label: "Credits",
      options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Credits: ${v[0]}, Max Credits: ${v[1]}`;
            } else if (v[0]) {
              return `Min Credits: ${v[0]}`;
            } else if (v[1]) {
              return `Max Credits: ${v[1]}`;
            }
            return [];
          },
          update: (filterList, filterPos, index) => {
            if (filterPos === 0) {
              filterList[index].splice(filterPos, 1, '');
            } else if (filterPos === 1) {
              filterList[index].splice(filterPos, 1);
            } else if (filterPos === -1) {
              filterList[index] = [];
            }
            return filterList;
          },
        },
        filterOptions: {
          names: [],
          logic(credits, filters) {
            if (filters[0] && filters[1]) {
              return credits <= filters[0] || credits >= filters[1];
            } else if (filters[0]) {
              return credits <= filters[0];
            } else if (filters[1]) {
              return credits >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Credits</FormLabel>
              <FormGroup row>
                <TextField
                  label='min'
                  type='number'
                  value={filterList[index][0] || ''}
                  onChange={event => {
                    filterList[index][0] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                  style={{ width: '45%', marginRight: '5%' }}
                />
                <TextField
                  label='max'
                  type='number'
                  value={filterList[index][1] || ''}
                  onChange={event => {
                    filterList[index][1] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                  style={{ width: '45%' }}
                />
              </FormGroup>
            </div>
          ),
        },
        searchable: false,
        sort: true,
      }
    },
    {
      name: "active",
      label: "Activity Status",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const user = userList[dataIndex];
          return (
            <Switch
              checked={user.active === 'Active'}
              onChange={(e) => handleChange(user, e.target.checked)}
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
      name: "edit",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const user = userList[dataIndex];
          return (
            <>
              <IconButton onClick={() => handleEdit(user)}>
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
  ]

  const options = {
    print: false,
    rowsPerPageOptions: [10, 15, 20],
    selectableRows: 'none',
    downloadOptions: {
      filename: 'userList.csv',
      separator: ',',
      filterOptions: {
        useDisplayedRowsOnly: true
      }
    },
    customToolbar: () => {
      return (
        <Tooltip title={"Add User"}>
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
            { name: 'Users' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
          <MUIDataTable
            title={"All Users"}
            data={userList}
            columns={columns}
            options={options}
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

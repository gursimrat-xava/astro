import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Card,
  IconButton,
  Switch,
  Icon,
  FormLabel,
  FormGroup,
  TextField,
} from '@material-ui/core'
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import Add from './Add'

const List = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(null)
  const [panditList, setPanditList] = useState([])
  const history = useHistory();

  useEffect(() => {
    firebase.firestore().collection('pandits').onSnapshot((pandits) => {
      const data = []
      pandits.forEach((pandit) => {
        // data.push(pandit.data())
        const tempData = pandit.data();
        tempData.active = tempData.active ? 'Active' : 'Inactive';
        data.push(tempData)
      })
      data.sort((a, b) => {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();
        return aName > bName ? 1 : aName < bName ? -1 : 0
      })
      setPanditList(data);
    })
  }, [])

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

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pandit = panditList[dataIndex];
          return (
            <div className="flex justify-start items-center">
              {
                pandit.pic ?
                  <Avatar alt={pandit.name} src={pandit.pic} />
                  :
                  <Avatar>{pandit.name[0].toUpperCase()}</Avatar>
              }
              <span className="text-16 font-bold ml-2 cursor-pointer" onClick={() => callHistory(pandit.uid)}>{pandit.name}</span>
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
      name: "languages",
      label: "Languages",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pandit = panditList[dataIndex];
          return pandit.languages && pandit.languages.join(', ');
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
      name: "hours",
      label: "Hours Worked",
      options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Hours: ${v[0]}, Max Hours: ${v[1]}`;
            } else if (v[0]) {
              return `Min Hours: ${v[0]}`;
            } else if (v[1]) {
              return `Max Hours: ${v[1]}`;
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
          logic(hours, filters) {
            if (filters[0] && filters[1]) {
              return hours <= filters[0] || hours >= filters[1];
            } else if (filters[0]) {
              return hours <= filters[0];
            } else if (filters[1]) {
              return hours >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Hours Worked</FormLabel>
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
          const pandit = panditList[dataIndex];
          return (
            <Switch
              checked={pandit.active === 'Active'}
              onChange={(e) => handleChange(pandit, e.target.checked)}
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
      name: "availability",
      label: "Availability",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pandit = panditList[dataIndex];
          return (
            <>
            {
              <div className="flex justify-center">
                <IconButton disabled = {!pandit.isOnline}>
                <Icon style={pandit.isOnline ? {color: "#22BB33"} : {}}>chat</Icon>
                </IconButton>
                <IconButton disabled = {!pandit.isOnline}>
                <Icon style={pandit.isOnline ? {color: "#22BB33"} : {}}>call</Icon>
                </IconButton>
              </div>
            }
            </>
          )
        },
        filter: false,
        searchable: false,
        sort: false,
      }
    },  
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pandit = panditList[dataIndex];
          return (
            <>
              <IconButton onClick={() => handleEdit(pandit)}>
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
      filename: 'panditList.csv',
      separator: ',',
      filterOptions: {
        useDisplayedRowsOnly: true
      }
    },
    customToolbar: () => {
      return (
        <Tooltip title={"Add Pandit"}>
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
            { name: 'Pandits' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
          <MUIDataTable
              title={"All Pandits"}
              data={panditList}
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

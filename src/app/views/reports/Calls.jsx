import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import {
  Card,
  FormLabel,
  FormGroup,
  TextField,
} from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

const List = () => {
  // const [rowsPerPage, setRowsPerPage] = useState(5)
  // const [page, setPage] = useState(0)
  const [callList, setCallList] = useState([])
  const columns = [
    {
      name: "caller",
      label: "User",
      options: {
        customFilterListOptions: {
          render: v => `User: ${v}`
        },
        filter: true,
        filterType: 'textField',
        sort: true,
      }
    },
    {
      name: "receiver",
      label: "Pandit",
      options: {
        filter: true,
        customFilterListOptions: {
          render: v => `Pandit: ${v}`
        },
        filterType: 'textField',
        sort: true,
      }
    },
    {
      name: "startTime",
      label: "Start Date Time",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const startTime = callList[dataIndex].startTime
          return `${startTime.toDateString()} ${startTime.getHours()}:${startTime.getMinutes()}`;
        },
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Start Date Time: ${v[0].toDateString()} ${v[0].getHours()}:${v[0].getMinutes()}, Max Start Date Time: ${v[1].toDateString()} ${v[1].getHours()}:${v[1].getMinutes()}`;
            } else if (v[0]) {
              return `Min Start Date Time: ${v[0].toDateString()} ${v[0].getHours()}:${v[0].getMinutes()}`;
            } else if (v[1]) {
              return `Max Start Date Time: ${v[1].toDateString()} ${v[1].getHours()}:${v[1].getMinutes()}`;
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
      name: "duration",
      label: "Duration",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const duration = callList[dataIndex].duration
          return `${duration < 60 ? '' : duration / 60 + 'm'} ${duration % 60}s`
        },
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Duration: ${v[0]}, Max Duration: ${v[1]}`;
            } else if (v[0]) {
              return `Min Duration: ${v[0]}`;
            } else if (v[1]) {
              return `Max Duration: ${v[1]}`;
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
          logic(age, filters) {
            if (filters[0] && filters[1]) {
              return age <= filters[0] || age >= filters[1];
            } else if (filters[0]) {
              return age <= filters[0];
            } else if (filters[1]) {
              return age >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Duration(seconds)</FormLabel>
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
          logic(age, filters) {
            if (filters[0] && filters[1]) {
              return age <= filters[0] || age >= filters[1];
            } else if (filters[0]) {
              return age <= filters[0];
            } else if (filters[1]) {
              return age >= filters[1];
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
      name: "balanceAfterCall",
      label: "Balance After Call",
      options: {
        filter: false,
      }
    },
  ];
  const options = {
    print: false,
    rowsPerPageOptions: [10, 15, 20],
    selectableRows: 'none',
    downloadOptions: {
      filename: 'tableDownload.csv',
      separator: ',',
      filterOptions: {
        useDisplayedRowsOnly: true
      }
    }
  };

  useEffect(() => {
    firebase.firestore().collection('calls').onSnapshot((calls) => {
      setCallList([])
      calls.forEach((call) => {
        console.log('call data', call.data());
        const callData = call.data()
        callData.duration = callData.endTime - callData.startTime
        callData.startTime = new Date(callData.startTime.seconds * 1000)
        Promise.all([callData.caller.get(), callData.receiver.get()])
          .then(([callerData, receiverData]) => {
            callData.caller = callerData.data()
            callData.caller = callData.caller.firstName + ' ' + callData.caller.lastName
            callData.receiver = receiverData.data().name

            setCallList(prevList => [...prevList, callData])
          })
          .catch(e => console.log('error fetching call list', e))
      })
    })
  }, [])

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Reports', path: '/reports/calls' },
            { name: 'Calls' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
          <MUIDataTable
            title={"All Calls"}
            data={callList}
            columns={columns}
            options={options}
          />
        </div>
      </Card>
    </div>
  )
}

export default List

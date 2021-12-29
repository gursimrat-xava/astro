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

const History = () => {
  const [callList, setCallList] = useState([])
  const [panditName, setPanditName] = useState('');

  useEffect(() => {
    const panditId = (new URLSearchParams(window.location.search)).get("panditid");
    const panditRef = firebase.firestore().collection("pandits").doc(panditId)
    panditRef.get().then(doc => {
      if (doc.exists) {
        setPanditName(doc.data().name)
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    panditRef.collection("calls").get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(queryDocumentSnapshot => {
        const temp = queryDocumentSnapshot.data();
        temp.duration = (temp.minutes*60) + temp.seconds;
        temp.time = new Date(temp.time.seconds * 1000)
        data.push(temp);
      });
      setCallList(data);
    })
    .catch(err => {
      alert(err);
    });
    
  }, [])


  const columns = [
    {
      name: "callername",
      label: "User",
      options: {
        filter: true,
        customFilterListOptions: {
          render: v => `User: ${v}`
        },
        filterType: 'textField',
        sort: true,
      }
    },
    {
      name: "duration",
      label: "Duration",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const call = callList[dataIndex];
          const duration = (call.minutes * 60) + call.seconds;
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
          logic(duration, filters) {
            if (filters[0] && filters[1]) {
              return duration <= filters[0] || duration >= filters[1];
            } else if (filters[0]) {
              return duration <= filters[0];
            } else if (filters[1]) {
              return duration >= filters[1];
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
      name: "time",
      label: "Start Date Time",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const time = callList[dataIndex].time
          return `${time.toDateString()} ${time.getHours()}:${time.getMinutes()}`;
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
          logic(time, filters) {
            if (filters[0] && filters[1]) {
              return time <= filters[0] || time >= filters[1];
            } else if (filters[0]) {
              return time <= filters[0];
            } else if (filters[1]) {
              return time >= filters[1];
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
  ];

  const options = {
    print: false,
    rowsPerPageOptions: [10, 15, 20],
    selectableRows: 'none',
    downloadOptions: {
      filename: 'callList.csv',
      separator: ',',
      filterOptions: {
        useDisplayedRowsOnly: true
      }
    },
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Pandits', path: '/pandits/list' },
            { name: 'Call History' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
        {callList.length ? 
          <MUIDataTable
            title={`All Calls of ${panditName}`}
            data={callList}
            columns={columns}
            options={options}
          />
          : <p>No call records found for now!</p>}
        </div>
      </Card>
    </div>
  )
}

export default History

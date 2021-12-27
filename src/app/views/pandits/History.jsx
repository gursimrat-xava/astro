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
import Add from './Add'

const History = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(null)
  const [callList, setCallList] = useState([])

  useEffect(() => {


    firebase.firestore().collection("pandits").doc((new URLSearchParams(window.location.search)).get("panditid")).collection("calls").get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(queryDocumentSnapshot => {
        const temp = queryDocumentSnapshot.data();
        temp.duration = (temp.minutes*60) + temp.seconds;
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
      name: "recievername",
      label: "Reciever",
      options: {
        filter: true,
        customFilterListOptions: {
          render: v => `Reciever: ${v}`
        },
        filterType: 'textField',
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
            { name: 'Call History' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
        {callList.length ? 
          <MUIDataTable
            title={"All Calls"}
            data={callList}
            columns={columns}
            options={options}
          />
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

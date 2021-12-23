import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import {
  Card,
  Switch,
  FormLabel,
  FormGroup,
  TextField,
  IconButton,
} from '@material-ui/core'
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import Add from './Add'

const List = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [couponList, setCouponList] = useState([])

  useEffect(() => {
    firebase.firestore().collection('coupons').onSnapshot((pandits) => {
      const data = []
      pandits.forEach((coupon) => {
        const temp = coupon.data()
        temp.uid = coupon.id
        temp.active = temp.active ? 'Active' : 'Inactive'
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

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        customFilterListOptions: {
          render: v => `Name: ${v}`
        },
        filterType: 'textField',
        sort: true,
      }
    },
    {
      name: "value",
      label: "Value",
      options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Value: ${v[0]}, Max Value: ${v[1]}`;
            } else if (v[0]) {
              return `Min Value: ${v[0]}`;
            } else if (v[1]) {
              return `Max Value: ${v[1]}`;
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
          logic(value, filters) {
            if (filters[0] && filters[1]) {
              return value <= filters[0] || value >= filters[1];
            } else if (filters[0]) {
              return value <= filters[0];
            } else if (filters[1]) {
              return value >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Value</FormLabel>
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
      name: "maxUse",
      label: "Max use",
      options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min use: ${v[0]}, Max use: ${v[1]}`;
            } else if (v[0]) {
              return `Min use: ${v[0]}`;
            } else if (v[1]) {
              return `Max use: ${v[1]}`;
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
          logic(maxUse, filters) {
            if (filters[0] && filters[1]) {
              return maxUse <= filters[0] || maxUse >= filters[1];
            } else if (filters[0]) {
              return maxUse <= filters[0];
            } else if (filters[1]) {
              return maxUse >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Max use</FormLabel>
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
      name: "timesUsed",
      label: "Times used",
      options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              return `Min Value: ${v[0]}, Max Value: ${v[1]}`;
            } else if (v[0]) {
              return `Min Value: ${v[0]}`;
            } else if (v[1]) {
              return `Max Value: ${v[1]}`;
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
          logic(value, filters) {
            if (filters[0] && filters[1]) {
              return value <= filters[0] || value >= filters[1];
            } else if (filters[0]) {
              return value <= filters[0];
            } else if (filters[1]) {
              return value >= filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Times used</FormLabel>
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
          const coupon = couponList[dataIndex];
          return (
            <Switch
              checked={coupon.active === 'Active'}
              onChange={(e) => handleChange(coupon, e.target.checked)}
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
  ];

  const options = {
    print: false,
    rowsPerPageOptions: [10, 15, 20],
    selectableRows: 'none',
    downloadOptions: {
      filename: 'couponList.csv',
      separator: ',',
      filterOptions: {
        useDisplayedRowsOnly: true
      }
    },
    customToolbar: () => {
      return (
        <Tooltip title={"Add Coupon"}>
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
            { name: 'Coupons', path: '/coupons' },
          ]}
        />
      </div>
      <Card elevation={6} className="px-6 py-5 h-full">
        <div className="w-full overflow-auto">
          <MUIDataTable
            title={"All Coupons"}
            data={couponList}
            columns={columns}
            options={options}
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

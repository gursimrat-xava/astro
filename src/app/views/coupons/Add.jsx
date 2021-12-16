import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import DateFnsUtils from '@date-io/date-fns'
import firebase from 'config.js'
import Grid from '@material-ui/core/Grid'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
const Add = ({ open, setOpen }) => {
  const [name, setName] = useState('')
  const [value, setValue] = useState()
  const [maxUse, setMaxUse] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [loading, setLoading] = useState(false)


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    try {
      await firebase.firestore().collection('coupons').add({
        name,
        value,
        maxUse,
        startDate,
        endDate,
        timesUsed: 0, active: true
      })
      setLoading(false)
    }
    catch (e) {
      console.log("error", e)
      setLoading(false)
    }
    handleClose()
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">Add a New Coupon</DialogTitle>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <DialogContent>
          <TextValidator
            margin="dense"
            label="Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['Name field is required', 'Name field is not valid']}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Value"
            type="number"
            name="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            validators={[
              'required',
              'minNumber:1',
            ]}
            errorMessages={['Value field is required', 'Value has to be greater than 0']}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Maximum use times"
            type="number"
            name="maxUse"
            value={maxUse}
            onChange={(e) => setMaxUse(e.target.value)}
            validators={[
              'required',
              'minNumber:1',
            ]}
            errorMessages={['Maximum use times field is required', 'Maximum use times has to be greater than 0']}
            variant="outlined"
            fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div style={{width:'100%'}}>
              <KeyboardDatePicker
                margin="normal"
                style={{width:'100%'}}
                id="mui-pickers-date"
                label="Start Date"
                value={startDate}
                onChange={(e) => { console.log('start date', e); setStartDate(e) }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
               <KeyboardTimePicker
                margin="normal"
                style={{width:'100%'}}
                id="mui-pickers-date"
                label="Start Time"
                value={startDate}
                onChange={(e) => { setStartDate(e) }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
               <KeyboardDatePicker
                margin="normal"
                style={{width:'100%'}}
                id="mui-pickers-date"
                label="End Date"
                value={endDate}
                onChange={(e) => { setEndDate(e) }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
               <KeyboardTimePicker
                margin="normal"
                style={{width:'100%'}}
                id="mui-pickers-date"
                label="Start Date"
                value={endDate}
                onChange={(e) => { setEndDate(e) }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </div>
          </MuiPickersUtilsProvider>
          
        </DialogContent>
        <DialogActions className="mb-4">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {loading ?
            <Button className="mx-4" type="submit" variant="contained" color="primary">
              <CircularProgress size={24} />
            </Button>
            :
            <Button className="mx-4" type="submit" variant="contained" color="primary">
              Add
            </Button>
          }
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default Add

import React, { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Icon
} from '@material-ui/core'
import firebase from 'config.js'

const BulkAdd = ({ open, setOpen, setOpenAdd }) => {

  const [loading, setLoading] = useState(false)


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
      <DialogTitle id="form-dialog-title">{'Bulk Add New Pandits'}</DialogTitle>
      <DialogContent>
        <div className="flex flex-column justify-between">
          <Button 
            className="m-3"
            variant="outlined"
            color="primary"
            onClick={() => {
              
            }}
          >
            <i className="fas fa-arrow-down mr-2" /> DOWNLOAD SAMPLE
          </Button>
          <Button 
            className="m-3"
            variant="contained"
            color="primary"
            onClick={() => {
              
            }}
          >
            <i className="fas fa-arrow-up mr-2" /> UPLOAD SPREADSHEET
          </Button>
        </div>
      </DialogContent>
      <DialogActions className="mb-4 flex flex-row justify-between">
        <Button 
          className="mx-4"
          variant="contained"
          color="primary"
          onClick={() => {
            handleClose();
            setOpenAdd(true);
          }}
        >
          Single Add
        </Button>
        <div>
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
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default BulkAdd

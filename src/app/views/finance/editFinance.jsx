import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'config.js'

const Add = ({ open, setOpen, edit, editUser }) => {
 
  const [key] = useState(editUser.key)
  const [value, setValue] = useState(editUser.value)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    try {
      if(edit) {
        await firebase.firestore().collection("finances").doc(editUser.id).set({ key, value}, { merge: true })
      }
      setLoading(false)
    }
    catch (e) {
      console.log("error", e)
      setLoading(false)
    }
    handleClose()
  }

  function handleClose() {
    setOpen(edit ? null : false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">{edit ? 'Edit Value' : 'Add a New User'}</DialogTitle>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <DialogContent>
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
            errorMessages={['Field is required', 'Field needs to be greater than 0']}
            variant="outlined"
            fullWidth
          />

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
              {edit ? 'Save' : 'Add'}
            </Button>
          }
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

Add.defaultProps = {
  edit: false,
  editUser: {}
}

export default Add

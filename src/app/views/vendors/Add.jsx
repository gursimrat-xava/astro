import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Button,
  CircularProgress,
} from '@material-ui/core'
import firebase from 'config.js'

const Add = ({ open, setOpen, edit, editPandit }) => {
  const [email, setEmail] = useState(editPandit.email)
  const [phone, setPhone] = useState(editPandit.phone)
  const [companyName, setCompanyName] = useState(editPandit.companyName)
  const [password, setPassword] = useState(editPandit.password)
  const [address, setAddress] = useState(editPandit.address)
  const [username, setUsername] = useState(editPandit.username)
  const [bankAcc, setBankAcc] = useState(editPandit.bankAcc)
  const [ifsc, setIfsc] = useState(editPandit.ifsc)
  const [bankName, setBankName] = useState(editPandit.bankName)
  const [bankAdd, setBankAdd] = useState(editPandit.bankAdd)
  const [accType, setAccType] = useState(editPandit.accType)

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); 
    setLoading(true)
    try {
      if (!edit) {
        let panditCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)

        await firebase.firestore().collection("vendors").doc(panditCredential.user.uid).set({
          email,
          phone,
          companyName,
          password,
          address,
          username,
          bankAcc,
          ifsc,
          bankName,
          bankAdd,
          accType,
          active: true,
          uid: panditCredential.user.uid,
          createdAt:  new Date(),
        })
      }
      else {
        await firebase.firestore().collection("vendors").doc(editPandit.uid).set({
          companyName,
          username,
          address,
          bankAcc,
          ifsc,
          bankName,
          bankAdd,
          accType,
        }, { merge: true })
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
      <DialogTitle id="form-dialog-title">{edit ? 'Edit Vendor' : 'Add a New Vendor'}</DialogTitle>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <DialogContent>
          {
            !edit && (
              <>
                <TextValidator
                  autoFocus
                  margin="dense"
                  label="Email*"
                  type="email"
                  name="email"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  validators={['required', 'isEmail']}
                  errorMessages={[
                    'Email field is required',
                    'Email is not valid',
                  ]}
                  variant="outlined"
                  fullWidth
                />
                <TextValidator
                  margin="dense"
                  label="Phone Number*"
                  type="text"
                  name="phone"
                  value={phone || ''}
                  onChange={(e) => setPhone(e.target.value)}
                  validators={['required', 'isNumber', 'minNumber:0',]}
                  errorMessages={[
                    'Phone Number field is required',
                    'Phone Number is not valid',
                    'Phone Number is not valid',
                  ]}
                  variant="outlined"
                  fullWidth
                />
              </>
            )
          }
          <TextValidator
            margin="dense"
            label="companyName*"
            type="text"
            name="companyName"
            value={companyName || ''}
            onChange={(e) => setCompanyName(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['companyName field is required', 'companyName field is not valid']}
            variant="outlined"
            fullWidth
          />
          {!edit && (
            <TextValidator
              margin="dense"
              label="Username*"
              type="text"
              name="username"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              validators={['required', 'trim']}
              errorMessages={['Username field is required', 'Username field is not valid']}
              variant="outlined"
              fullWidth
            />
          )}
          <TextValidator
            margin="dense"
            label="Address*"
            type="text"
            name="address"
            value={address || ''}
            onChange={(e) => setAddress(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['Address field is required', 'Address field is not valid']}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Bank Account Number"
            type="text"
            name="bankAcc"
            value={bankAcc || ''}
            onChange={(e) => setBankAcc(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Ifsc Code"
            type="text"
            name="ifsc"
            value={ifsc || ''}
            onChange={(e) => setIfsc(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Bank Name"
            type="text"
            name="bankName"
            value={bankName || ''}
            onChange={(e) => setBankName(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Bank Address"
            type="text"
            name="bankAdd"
            value={bankAdd || ''}
            onChange={(e) => setBankAdd(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Account Type"
            select
            name="accType"
            value={accType || ''}
            onChange={(e) => setAccType(e.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="Savings">
              Savings
            </MenuItem>
            <MenuItem value="Current">
              Current
            </MenuItem>
          </TextValidator>
          {
            !edit && (
              <TextValidator
                margin="dense"
                label="Password*"
                type="password"
                name="password"
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
                validators={[
                  'required',
                  'minStringLength: 6',
                ]}
                errorMessages={['Password field is required', 'Password should be atleast 6 characters long']}
                variant="outlined"
                fullWidth
              />
            )
          }

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
  editPandit: {}
}

export default Add

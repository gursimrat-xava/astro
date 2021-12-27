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
import Autocomplete from '@material-ui/lab/Autocomplete'
import firebase from 'config.js'

const Add = ({ open, setOpen, edit, editPandit }) => {
  const [email, setEmail] = useState(editPandit.email)
  const [phone, setPhone] = useState(editPandit.phone)
  const [name, setName] = useState(editPandit.name)
  const [languages, setLanguages] = useState(editPandit.languages)
  const [password, setPassword] = useState(editPandit.password)
  const [age, setAge] = useState(editPandit.age)
  const [address, setAddress] = useState(editPandit.address)
  const [username, setUsername] = useState(editPandit.username)
  const [qualification, setQualification] = useState(editPandit.qualification)
  const [specialities, setSpecialities] = useState(editPandit.speciality)
  const [bankAcc, setBankAcc] = useState(editPandit.bankAcc)
  const [ifsc, setIfsc] = useState(editPandit.ifsc)
  const [bankName, setBankName] = useState(editPandit.bankName)
  const [bankAdd, setBankAdd] = useState(editPandit.bankAdd)
  const [accType, setAccType] = useState(editPandit.accType)

  const [loading, setLoading] = useState(false)

  ValidatorForm.addValidationRule('isLanguageFilled', (value) => {
    if (languages && languages.length !== 0) {
      return true;
    }
    return false;
  });

  ValidatorForm.addValidationRule('isSpecialityFilled', (value) => {
    if (specialities && specialities.length !== 0) {
      return true;
    }
    return false;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    try {
      if (!edit) {
        let panditCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)

        // convert image to base 64
        // let reader = new FileReader();
        // reader.onload = function () {
        //   dataSend.profile_photo = reader.result;
        // }
        // reader.readAsDataURL(dataSend.profile_photo);

        await firebase.firestore().collection("pandits").doc(panditCredential.user.uid).set({
          email,
          phone,
          name,
          languages,
          password,
          age,
          address,
          username,
          qualification,
          specialities,
          bankAcc,
          ifsc,
          bankName,
          bankAdd,
          accType,
          active: true,
          hours: 0,
          balanceConsumed : 0,
          minutesConsumed : 0,
          chatsReplied : 0,
          uid: panditCredential.user.uid,
          createdAt:  new Date(),
        })
      }
      else {
        await firebase.firestore().collection("pandits").doc(editPandit.uid).set({
          name,
          languages,
          age,
          address,
          qualification,
          specialities,
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
      <DialogTitle id="form-dialog-title">{edit ? 'Edit Pandit' : 'Add a New Pandit'}</DialogTitle>
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
            label="Name*"
            type="text"
            name="name"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['Name field is required', 'Name field is not valid']}
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
            label="Age*"
            type="number"
            name="age"
            value={age || ''}
            onChange={(e) => setAge(e.target.value)}
            validators={[
              'required',
              'minNumber:0',
            ]}
            errorMessages={['Age field is required', 'Age cannot be less than 0']}
            variant="outlined"
            fullWidth
          />
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
            label="Qualification*"
            type="text"
            name="qualification"
            value={qualification || ''}
            onChange={(e) => setQualification(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['Qualification field is required', 'Qualification field is not valid']}
            variant="outlined"
            fullWidth
          />
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            autoSelect
            value={languages || ''}
            onChange={(e, val) => setLanguages(val)}
            renderInput={(params) => (
              <TextValidator
                {...params}
                margin="dense"
                variant="outlined"
                label="Languages*"
                validators={['isLanguageFilled']}
                errorMessages={['Languages field is required']}
                fullWidth
              />
            )}
          />
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            autoSelect
            value={specialities || ''}
            onChange={(e, val) => setSpecialities(val)}
            renderInput={(params) => (
              <TextValidator
                {...params}
                margin="dense"
                variant="outlined"
                label="Specialities*"
                validators={['isSpecialityFilled']}
                errorMessages={['Specialities field is required']}
                fullWidth
              />
            )}
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

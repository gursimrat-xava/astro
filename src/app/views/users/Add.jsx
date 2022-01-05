import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import firebase from 'config.js'

const Add = ({ open, setOpen, edit, editUser }) => {
  const [email, setEmail] = useState(editUser.email)
  const [phone, setPhone] = useState(editUser.phone)
  const [firstName, setFirstName] = useState(editUser.firstName)
  const [lastName, setLastName] = useState(editUser.lastName)
  const [gender, setGender] = useState(editUser.gender)
  const [dateOfBirth, setDateOfBirth] = useState(editUser.dateOfBirth && new Date(editUser.dateOfBirth.seconds * 1000))
  const [timeOfBirth, setTimeOfBirth] = useState(editUser.timeOfBirth && new Date((+editUser.timeOfBirth.split(':')[0]*60 + +editUser.timeOfBirth.split(':')[1] - 330)*60000))
  const [placeOfBirth, setPlaceOfBirth] = useState(editUser.placeOfBirth)
  const [password, setPassword] = useState(editUser.password)
  const [credits, setCredits] = useState(editUser.credits)
  const [languages, setLanguages] = useState(editUser.languages)
  const [loading, setLoading] = useState(false)

  ValidatorForm.addValidationRule('isLanguageFilled', (value) => {
    if (languages && languages.length !== 0) {
      return true;
    }
    return false;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    try {
      if (!edit) {
        let userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)

        // convert image to base 64
        // let reader = new FileReader();
        // reader.onload = function () {
        //   dataSend.profile_photo = reader.result;
        // }
        // reader.readAsDataURL(dataSend.profile_photo);
        await firebase.firestore().collection("users").doc(userCredential.user.uid).set({
          email,
          firstName,
          lastName,
          languages,
          gender,
          dateOfBirth,
          timeOfBirth: timeOfBirth ? timeOfBirth.getHours() + ":" + timeOfBirth.getMinutes() : undefined,
          placeOfBirth,
          active: true,
          uid: userCredential.user.uid,
          credits: 0,
          createdAt: new Date(),
        })
      }
      else {
        await firebase.firestore().collection("users").doc(editUser.uid).set({
          email,
          firstName,
          lastName,
          languages,
          gender,
          dateOfBirth,
          timeOfBirth: timeOfBirth ? timeOfBirth.getHours() + ":" + timeOfBirth.getMinutes() : undefined,
          placeOfBirth,
          credits,
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
      <DialogTitle id="form-dialog-title">{edit ? 'Edit User' : 'Add a New User'}</DialogTitle>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <DialogContent>
          {
            !edit && (
              <>
                <TextValidator
                  autoFocus
                  margin="dense"
                  label="Email"
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
                  label="Phone Number"
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
            label="First Name"
            type="text"
            name="firstName"
            value={firstName || ''}
            onChange={(e) => setFirstName(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['First Name field is required', 'First Name field is not valid']}
            variant="outlined"
            fullWidth
          />
          <TextValidator
            margin="dense"
            label="Last Name"
            type="text"
            name="lastName"
            value={lastName || ''}
            onChange={(e) => setLastName(e.target.value)}
            validators={['required', 'trim']}
            errorMessages={['Last Name field is required', 'Last Name field is not valid']}
            variant="outlined"
            fullWidth
          />
          <RadioGroup
            className="items-center"
            value={gender || ''}
            name="gender"
            onChange={(e) => setGender(e.target.value)}
            row
          >
            <span className="mr-3">Gender: </span>
            <FormControlLabel
              value="Male"
              control={<Radio color="primary" />}
              label="Male"
              labelPlacement="end"
            />
            <FormControlLabel
              value="Female"
              control={<Radio color="primary" />}
              label="Female"
              labelPlacement="end"
            />
            <FormControlLabel
              value="Others"
              control={<Radio color="primary" />}
              label="Others"
              labelPlacement="end"
            />
          </RadioGroup>
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
                label="Languages"
                validators={['isLanguageFilled']}
                errorMessages={['Languages field is required']}
                fullWidth
              />
            )}
          />
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
          >
            <KeyboardDatePicker
              className="my-2"
              margin="dense"
              label="Date of birth"
              inputVariant="outlined"
              type="text"
              size="small"
              autoOk={true}
              value={dateOfBirth || null}
              format="MMMM dd, yyyy"
              onChange={(date) => setDateOfBirth(date)}
              fullWidth
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
          >
            <KeyboardTimePicker
              label="Time of birth"
              margin="dense"
              inputVariant="outlined"
              ampm={false}
              value={timeOfBirth || null}
              onChange={time => setTimeOfBirth(time)}
              fullWidth
            />
          </MuiPickersUtilsProvider>
          <TextValidator
            margin="dense"
            label="Place of birth"
            type="text"
            name="placeOfBirth"
            value={placeOfBirth || ''}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            variant="outlined"
            fullWidth
          />
          {
            edit ? (
              <TextValidator
                margin="dense"
                label="Credits"
                type="number"
                name="credits"
                value={credits !== undefined ? credits : ''}
                onChange={(e) => setCredits(e.target.value)}
                validators={[
                  'required',
                  'minNumber:0',
                ]}
                errorMessages={['Credits field is required', 'Credits cannot be less than 0']}
                variant="outlined"
                fullWidth
              />
            ) : (
              <TextValidator
                margin="dense"
                label="Password"
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
  editUser: {}
}

export default Add

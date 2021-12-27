import React, { useState } from 'react'
import {
  Card,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import firebase from 'config.js';

import { makeStyles } from '@material-ui/core/styles'
import history from 'history.js'
import clsx from 'clsx'

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: '#1A2038',
  },
  card: {
    maxWidth: 800,
    borderRadius: 12,
    margin: '1rem',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

const JwtLogin = () => {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    role: 'admin'
  })
  const [message, setMessage] = useState('')

  const classes = useStyles()

  const handleChange = ({ target: { name, value } }) => {
    let temp = { ...userInfo }
    temp[name] = value
    setUserInfo(temp)
  }

  const signIn = () => {
    localStorage.setItem("user", JSON.stringify({ role: userInfo.role }));
    firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password).then((user) => {
      localStorage.setItem("user", JSON.stringify({ ...user, role: userInfo.role }));
      setLoading(false);
      history.push(userInfo.role!=='vendor' ? process.env.PUBLIC_URL + '/' : process.env.PUBLIC_URL + '/pandits/list')
    }).catch(e => {
      console.log("error singing in ", e);
      setMessage(e.message)
      setLoading(false);
    });
  }


  const handleFormSubmit = (event) => {
    setLoading(true)
    if(userInfo.role === 'admin') {
      firebase.firestore().collection("superadmin").doc("superadmin").get().then(doc => {
        if (userInfo.email !== doc.data().email) {
          firebase.auth().signOut();
          setLoading(false)
        }
        else {
          signIn();
        }
      })
    }
    else if(userInfo.role === 'vendor') {
      firebase.firestore().collection("vendors").where('email', '==', userInfo.email).get().then(doc => {
        if (userInfo.email !== doc.docs[0].data().email) {
          firebase.auth().signOut();
          setLoading(false)
        }
        else {
          signIn();
        }
      })
    }
  }

  return (
    <div
      className={clsx(
        'flex justify-center items-center  min-h-full-screen',
        classes.cardHolder
      )}
    >
      <Card className={classes.card}>
        <Grid container>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <div className="p-8 flex justify-center items-center h-full">
              <img
                className="w-200 mb-4"
                src={process.env.PUBLIC_URL + '/assets/images/logo.png'}
                alt=""
              />
            </div>
          </Grid>
          <Grid item lg={7} md={7} sm={7} xs={12}>
            <div className="p-8 h-full bg-light-gray relative">
              <ValidatorForm onSubmit={handleFormSubmit}>
                <TextValidator
                  className="mb-6 w-full"
                  variant="outlined"
                  size="small"
                  label="Email"
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={userInfo.email}
                  validators={['required', 'isEmail']}
                  errorMessages={[
                    'this field is required',
                    'email is not valid',
                  ]}
                />
                <TextValidator
                  className="mb-6 w-full"
                  label="Password"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  name="password"
                  type="password"
                  value={userInfo.password}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
                <TextValidator
                  className="mb-3 w-full"
                  label="Role"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  name="role"
                  select
                  value={userInfo.role}
                >
                  <MenuItem value="admin">
                    Admin
                  </MenuItem>
                  <MenuItem value="vendor">
                    Vendor
                  </MenuItem>
                </TextValidator>

                {message && (
                  <p className="text-error">{message}</p>
                )}

                <div className="flex flex-wrap items-center mb-4">
                  <div className="relative">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      type="submit"
                    >
                      Sign in
                    </Button>
                    {loading && (
                      <CircularProgress
                        size={24}
                        className={
                          classes.buttonProgress
                        }
                      />
                    )}
                  </div>
                  {/* <span className="mr-2 ml-5">or</span>
                                    <Button
                                        className="capitalize"
                                        onClick={() =>
                                            history.push('/session/signup')
                                        }
                                    >
                                        Sign up
                                    </Button> */}
                </div>
                {/* <Button
                                    className="text-primary"
                                    onClick={() =>
                                        history.push('/session/forgot-password')
                                    }
                                >
                                    Forgot password?
                                </Button> */}
              </ValidatorForm>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default JwtLogin

import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'app/components'
import firebase from 'config.js'
import { classList } from 'utils'
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

const Banners = () => {


  const [rechargePage, setRechargePage] = useState(null)
  const [banner1, setBanner1] = useState(null)
  const [banner2, setBanner2] = useState(null)
  const [banner3, setBanner3] = useState(null)
  const [banner4, setBanner4] = useState(null)
  const [banner5, setBanner5] = useState(null)
  //const [rechargePage, setRechargePage] = useState('https://firebasestorage.googleapis.com/v0/b/astroplus-c0e60.appspot.com/o/banners%2Fcash-back.png?alt=media&token=4f724fac-4d60-4e76-ad42-047e3c3a04a4')
  //const [homePage, setHomePage] = useState(['https://firebasestorage.googleapis.com/v0/b/astroplus-c0e60.appspot.com/o/banners%2Fstars.png?alt=media&token=087ec29a-fcc9-4b0f-a211-6de699be4d91','2','3','4','5'])

  useEffect(() => {
    firebase.firestore().collection('banners').doc('images').onSnapshot((banners) => {

      setRechargePage(banners.data().rechargePage)
      setBanner1(banners.data().homePage[0])
      setBanner2(banners.data().homePage[1])
      setBanner3(banners.data().homePage[2])
      setBanner4(banners.data().homePage[3])
      setBanner5(banners.data().homePage[4])
     
    })

  }, [])


  const uploadFile = (e) => {

  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let homePage = [banner1];

       // Update banners

        firebase.firestore().collection("banners").doc('images').set({
          homePage,
          rechargePage
        })
        alert('Banner Updated');

        /*
        <TextValidator
            label="Repeat password"
            onChange={uploadFile}
            name="banner1"
            type="file"
        />
        */
    }
    catch (e) {
      console.log("error", e)
    }
  }


  return (
   
    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
    <DialogContent>
        <h3>Homepage Banners Url</h3>
        
        <TextValidator
                    autoFocus
                    margin="dense"
                    label=""
                    name="banner"
                    type="text"
                    onChange={(e) => setBanner1(e.target.value)}
                    variant="outlined"
                    fullWidth
                    validators={['required']}
                    errorMessages={['this field is required']}
                    value={banner1 || ''}
                />
        <TextValidator
                    autoFocus
                    margin="dense"
                    label=""
                    name="banner"
                    type="text"
                    onChange={(e) => setBanner2(e.target.value)}
                    variant="outlined"
                    fullWidth
                    errorMessages={['this field is required']}
                    value={banner2 || ''}
                />
        <TextValidator
                    autoFocus
                    margin="dense"
                    label=""
                    name="banner"
                    type="text"
                    onChange={(e) => setBanner3(e.target.value)}
                    variant="outlined"
                    fullWidth
                    errorMessages={['this field is required']}
                    value={banner3 || ''}
                />
        <TextValidator
                    autoFocus
                    margin="dense"
                    label=""
                    name="banner"
                    type="text"
                    onChange={(e) => setBanner4(e.target.value)}
                    variant="outlined"
                    fullWidth
                    errorMessages={['this field is required']}
                    value={banner4 || ''}
                />
        <TextValidator
                    autoFocus
                    margin="dense"
                    label=""
                    name="banner"
                    type="text"
                    onChange={(e) => setBanner5(e.target.value)}
                    variant="outlined"
                    fullWidth
                    errorMessages={['this field is required']}
                    value={banner5 || ''}
                />
    </DialogContent>
    <DialogContent>
        <h3>Recharge Page Banner Url </h3>
          <TextValidator
              autoFocus
              margin="dense"
              label=""
              name="banner"
              type="text"
              onChange={(e) => setRechargePage(e.target.value)}
              variant="outlined"
              fullWidth
              validators={['required']}
              errorMessages={['this field is required']}
              value={rechargePage || ''}
          />
    </DialogContent>
    <DialogActions className="mb-4">
          
          <Button className="mx-4" type="submit" variant="contained" color="primary">
              Update
            </Button>
        </DialogActions>
        </ValidatorForm>
  )
}

export default Banners

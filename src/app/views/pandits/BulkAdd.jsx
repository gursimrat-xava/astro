import React, { useState, useContext } from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    CircularProgress,
} from '@material-ui/core'
import firebase from 'config.js'
import { AuthContext } from '../../auth/AuthGuard'
import ReactFileReader from 'react-file-reader'
const BulkAdd = ({ open, setOpen, setOpenAdd }) => {
    const [loading, setLoading] = useState(false)

    const { currentUser } = useContext(AuthContext)

    function handleClose() {
        setOpen(false)
    }

    const createUser = async (cells) => {
        const email = cells[1]
        const phone = cells[2]
        const name = cells[3]
        const username = cells[4]
        const age = cells[5]
        const address = cells[6]
        const qualification = cells[7]
        const languages = cells[8]
        const specialities = cells[9]
        const bankAcc = cells[10]
        const ifsc = cells[11]
        const bankName = cells[12]
        const bankAdd = cells[13]
        const accType = cells[14]
        const password = cells[15]
        try {
            let panditCredential = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
            await firebase
                .firestore()
                .collection('pandits')
                .doc(panditCredential.user.uid)
                .set({
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
                    balanceConsumed: 0,
                    minutesConsumed: 0,
                    chatsReplied: 0,
                    uid: panditCredential.user.uid,
                    createdAt: new Date(),
                    vendorEmail: currentUser.email,
                })
        } catch (err) {
            console.error(err)
            console.error(`Unable to register ${email}`)
        }
    }

    const uploadFile = (files) => {
        setLoading(true)
        var reader = new FileReader()
        reader.readAsText(files[0])
        reader.onload = async (e) => {
            const rows = reader.result.toString().split('\n')
            rows.shift()
            for (const row of rows) {
                if (row) {
                    const cells = row.split(',')
                    if (cells && cells[1] !== '') {
                        await createUser(cells)
                    } else {
                        console.log(`${cells[0]} Not valid`)
                    }
                }
            }
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle id="form-dialog-title">
                {'Bulk Add New Pandits'}
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-column justify-between">
                    <Button
                        className="m-3"
                        variant="outlined"
                        color="primary"
                        onClick={() => {}}
                    >
                        <i className="fas fa-arrow-down mr-2" /> DOWNLOAD SAMPLE
                    </Button>

                    <div className={`${loading && 'hidden'}`}>
                        <ReactFileReader
                            fileTypes={['.csv']}
                            handleFiles={(files) => uploadFile(files)}
                        >
                            <div className="w-full px-3">
                                <Button
                                    className="my-3 w-full"
                                    variant="contained"
                                    color="primary"
                                >
                                    <i className="fas fa-arrow-up mr-2" /> UPLOAD
                                    SPREADSHEET
                                </Button>
                            </div>
                        </ReactFileReader>
                    </div>
                    {loading && 
                        <Button className="m-3" variant="contained" color="primary">
                            <CircularProgress size={24} color="inherit" />
                        </Button>
                    }
                </div>
            </DialogContent>
            <DialogActions className="mb-4 flex flex-row justify-between">
                <Button
                    className="mx-4"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        handleClose()
                        setOpenAdd(true)
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
                    
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default BulkAdd

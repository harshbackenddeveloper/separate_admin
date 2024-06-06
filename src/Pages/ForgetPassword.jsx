import React, { useState } from 'react'
import { CardActions, CardContent, Button, TextField, Card } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { makeApi } from '../helper/MakeApi';
import Loader from '../Common/Loader';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await makeApi('post', "/v1/forgotPassword", { email: userEmail });
            console.log("respose", response)
            if (response.hasError === true) {
                toast.error(response.error.message)
            }
            else {
                toast.success('Please check your email for the reset password link.');
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#508bfc" }}>
                <Card sx={{ minWidth: 400 }}>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <TextField label="Email" variant="outlined" sx={{ width: '100%', marginTop: '12px' }} id='userEmail' name='userEmail' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? <Loader /> : <Button variant="contained" sx={{ marginBottom: '12px' }} type='submit'>Submit</Button>}
                        </CardActions>
                    </form>
                </Card>
            </div>
        </>
    )
}

export default ForgetPassword
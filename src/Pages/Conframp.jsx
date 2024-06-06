import React, { useState } from 'react'
import { CardActions, CardContent, Button, Card, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeApi } from '../helper/MakeApi';
import Loader from '../Common/Loader';

const Conframp = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    password: "",
    password_confirmation: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((oldVal) => ({
      ...oldVal,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (userData.password !== userData.password_confirmation) {
        toast.error('password and confirm_password must be same');
        return
      }
      const response = await makeApi('post', '/v1/Resetpassword', { token: token, password: userData.password, password_confirmation: userData.password_confirmation });
      console.log("response", response)
      if (response.hasError === true) {
        toast.error(response.error.message)
      } else {
        toast.success(response.error.message)
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
        <form onSubmit={handleSubmit}>
          <Card sx={{ minWidth: 400 }}>
            <h4 className='text-center mb-0 pt-3'>Create Password</h4>
            <CardContent>
              <TextField label="password " variant="outlined" sx={{ width: '100%', }}
                id="password_confirmation"
                name="password_confirmation"
                value={userData.password_confirmation}
                onChange={handleChange}
              />

              <TextField label="Confirm  password " variant="outlined" sx={{ width: '100%', marginTop: '12px', }}
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
              />

            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? <Loader /> : <Button variant="contained" sx={{ marginBottom: '12px' }} type='submit'>Submit</Button>}
            </CardActions>
          </Card>
        </form>
      </div>
    </>
  )
}

export default Conframp
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import { makeApi } from '../helper/MakeApi';
import Loader from './Loader';
import './css/Login.css'
const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((oldVal) => ({
            ...oldVal,
            [name]: value

        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const UserLogin = await makeApi('post', '/v1/adminLogin', formData);
            console.log("login", UserLogin);

            if (UserLogin.hasError == true) {
                toast.error(UserLogin.error.message)
            } else {
                sessionStorage.setItem("token", JSON.stringify(UserLogin.data.token));
                sessionStorage.setItem("User_Role", JSON.stringify(UserLogin.data.role));
                toast.success('login successfully')
                navigate('/dashboard')
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="container-fluid  mgulmnbg " >
                <div className="container login-main ">
                    <div className="col-lg-6  col-xl-5 col-xxl-5">
                        <div className="card p-2">
                            <form onSubmit={handleSubmit}>
                                <div className="card-body  text-center">
                                    <h3 className="mb-4 fw-bold">Admin Sign in</h3>

                                    <TextField type='text' variant="outlined" className='w-100 mb-3' placeholder='Email'
                                        name='email'
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="current-email"
                                    />

                                    <TextField type='password' variant="outlined" className='w-100 mb-4' placeholder='Password'
                                        name='password'
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                    />
                                    <div className='d-flex justify-content-end align-items-center flex-wrap'>
                                        <Link className='fw-bold' to='/forgetpassword'>Forgot password?</Link>
                                    </div>
                                    {loading ? (<Loader />) : (<button className="btn btn-primary btn-md mt-3 btn-block" type="submit"> Login </button>)}
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
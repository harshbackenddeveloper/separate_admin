import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { makeApi } from '../helper/MakeApi';
import Loader from '../Common/Loader';
import Layout from '../Component/Layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Create_Edit_form = () => {
    const { names } = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false)

    const [selectedDate, setSelectedDate] = useState(null);
    const [slaExpiryDate, setSlaExpiryDate] = useState("");
    const [clientExpiryDate, setClientExpiryDate] = useState("");
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [userDetails, setUserDetails] = useState({
        surveyor_or_Firm_name: "",
        last_name: "",
        client_id: "",
        password: "",
        sla_number: "",
        iiisla_number: "",
        link_limit: "",
        space: "",
        email: "",
        mobile: "",
        address: "",
        remark: "",
    });


    //function to get user department list 
    const getDepartmentList = async () => {
        setLoading(true)
        try {
            const response = await makeApi("get", "/v1/departmentlist");
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                setDepartmentList(response.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getDetailsById = async () => {
        setLoadingUpdate(true)
        try {
            console.log("namess", names)
            const response = await makeApi('post', "/v1/get/getuserbyid", { user_id: names });
            console.log("user response", response.data)
            if (response.hasError === true) {
                // toast.error(response.error.message)
            } else {
                const user = response.data[0];
                setUserDetails({
                    surveyor_or_Firm_name: user.surveyor_or_Firm_name || "",
                    last_name: user.last_name || "",
                    client_id: user.client_id || "",
                    password: "",
                    sla_number: user.sla_number || "",
                    iiisla_number: user.iiisla_number || "",
                    link_limit: user.link_limit || "",
                    space: user.space || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                    address: user.address || "",
                    remark: user.remark || "",
                });
                setSlaExpiryDate(dayjs(user.sla_expiry_date));
                setSelectedDate(dayjs(user.expiry_date));
                setClientExpiryDate(dayjs(user.client_expiry_date));
                setSelectedDepartment(user.department);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingUpdate(false)
        }
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            const user_expiry_date = dayjs(selectedDate).format('YYYY-MM-DD');
            const sla_expiry_date = dayjs(slaExpiryDate).format('YYYY-MM-DD');
            const client_expiry_date = dayjs(clientExpiryDate).format('YYYY-MM-DD');
            const formData = { ...values, expiry_date: user_expiry_date, department: selectedDepartment, sla_expiry_date: sla_expiry_date, client_expiry_date: client_expiry_date };

            const endpoint = names === "create" ? '/v1/createUser' : '/v1/updateUser';
            const response = await makeApi('post', endpoint, formData);


            console.log("response", response)

            if (response.hasError) {
                toast.error(response.error.message);
            } else {
                const successMessage = names === "create" ? 'Registered successfully' : 'User details updated successfully';
                toast.success(successMessage);
                navigate('/alluserlist');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response ? error.response.data.message : 'An error occurred');
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        getDepartmentList();
        getDetailsById();
    }, []);

    const previousSection = () => {
        navigate('/alluserlist')
    }

    return (
        <>
            <Layout />
            <div className='main-content app-content'>
            <button onClick={() => previousSection()}><ArrowBackIcon /></button>
                {loadingUpdate ? <Loader /> : (<div className="container-fluid">
                <div class="page-header"> {names === "create" ? (<h1 className="page-title my-auto">Create User </h1>) : (<h1 className="page-title my-auto">Edit User </h1>)}
                    {/* <div> 
                        <ol class="breadcrumb mb-0"> <li class="breadcrumb-item"> <a href="javascript:void(0)">Home</a> </li> 
                        <li class="breadcrumb-item active" aria-current="page">Dashboard 01</li> </ol> 
                    </div>  */}
                </div>
                    <div className="" >
                        <div className="col-lg-8  col-xl-6 col-xxl-6 mx-auto">
                            <div className="card p-5 ">
                                <Formik
                                    initialValues={{
                                        surveyor_or_Firm_name: userDetails.surveyor_or_Firm_name || '',
                                        last_name: userDetails.last_name || '',
                                        client_id: userDetails.client_id || '',
                                        password: userDetails.password || '',
                                        sla_number: userDetails.sla_number || '',
                                        iiisla_number: userDetails.iiisla_number || '',
                                        link_limit: userDetails.link_limit || '',
                                        space: userDetails.space || '',
                                        email: userDetails.email || '',
                                        mobile: userDetails.mobile || '',
                                        address: userDetails.address || '',
                                        remark: userDetails.remark || '',
                                    }}
                                    validationSchema={Yup.object({
                                        surveyor_or_Firm_name: Yup.string().required('Surveyor name/Firm name is required'),
                                        last_name: Yup.string().required('Last name is required'),
                                        client_id: Yup.string().required('Client ID is required'),
                                        password: names === "create" ? Yup.string().required('Password is required') : Yup.string(),
                                        sla_number: Yup.string().required('SLA Number is required'),
                                        iiisla_number: Yup.string().required('IIISLA Member Number is required'),
                                        link_limit: Yup.string().required('Link limit is required'),
                                        space: Yup.string().required('Storage size limit is required'),
                                        email: Yup.string().email('Invalid email address').required('Email is required'),
                                        mobile: Yup.string().required('Mobile number is required').matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
                                        address: Yup.string().required('Address is required'),
                                        remark: Yup.string().required('Remark is required'),
                                    })}
                                    onSubmit={handleSubmit}
                                >

                                    {formik => (
                                        <Form onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Surveyor name/Firm name" placeholder="Surveyor name/ Firm name"
                                                        name="surveyor_or_Firm_name"
                                                        id="surveyor_or_Firm_name"
                                                        value={formik.values.surveyor_or_Firm_name}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.surveyor_or_Firm_name && formik.errors.surveyor_or_Firm_name}
                                                    />
                                                    <ErrorMessage name="surveyor_or_Firm_name" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Last Name" placeholder="last_name"
                                                        name="last_name"
                                                        id="last_name"
                                                        value={formik.values.last_name}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.last_name && formik.errors.last_name}
                                                    />
                                                    <ErrorMessage name="last_name" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Address" placeholder="Address"
                                                        name="address"
                                                        id="address"
                                                        value={formik.values.address}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.address && formik.errors.address}
                                                    />
                                                    <ErrorMessage name="address" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Mobile" placeholder="Mobile"
                                                        name="mobile"
                                                        id="mobile"
                                                        value={formik.values.mobile}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.mobile && formik.errors.mobile}
                                                    />
                                                    <ErrorMessage name="mobile" component="div" className="text-danger" />
                                                </div>


                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Email" placeholder="Email"
                                                        name="email"
                                                        id="email"
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.email && formik.errors.email}
                                                    />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Password" placeholder="Password"
                                                        name="password"
                                                        id="password"
                                                        value={formik.values.password}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.password && formik.errors.password}
                                                    />
                                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Client Id" placeholder="Client Id"
                                                        name="client_id"
                                                        id="client_id"
                                                        value={formik.values.client_id}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.client_id && formik.errors.client_id}
                                                    />
                                                    <ErrorMessage name="client_id" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-1 ">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                            <DatePicker label="Expiry Date" variant="outlined" className=' w-100 mb-4' format="DD-MM-YYYY"
                                                                name='selectedDate'
                                                                id="selectedDate"
                                                                value={selectedDate ? selectedDate : null}
                                                                onChange={(newValue) => setSelectedDate(newValue)}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="SLA Number" placeholder="SLA Number"
                                                        name="sla_number"
                                                        id="sla_number"
                                                        value={formik.values.sla_number}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.sla_number && formik.errors.sla_number}
                                                    />
                                                    <ErrorMessage name="sla_number" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-1">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                            <DatePicker label="SLA Expiry" variant="outlined" className=' w-100 mb-4' format="DD-MM-YYYY"
                                                                name='slaExpiryDate'
                                                                id="slaExpiryDate"
                                                                value={slaExpiryDate ? slaExpiryDate : null}
                                                                onChange={(newValue) => setSlaExpiryDate(newValue)}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Space" placeholder="Space"
                                                        name="space"
                                                        id="space"
                                                        value={formik.values.space}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.space && formik.errors.space}
                                                    />
                                                    <ErrorMessage name="space" component="div" className="text-danger" />
                                                </div>


                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Link Limit" placeholder="Link Limit"
                                                        name="link_limit"
                                                        id="link_limit"
                                                        value={formik.values.link_limit}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.link_limit && formik.errors.link_limit}
                                                    />
                                                    <ErrorMessage name="link_limit" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <FormControl fullWidth>
                                                        <InputLabel >Department</InputLabel>
                                                        <Select
                                                            id="demo-simple-select"
                                                            value={selectedDepartment}
                                                            label="Department"
                                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                                        >
                                                            {loading ? <Loader /> : (
                                                                Array.isArray(departmentList) && departmentList.map((item) => (
                                                                    <MenuItem value={item.d_name} key={item.id}>{item.d_name}</MenuItem>
                                                                ))
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="IIISLA Member Number" placeholder="eg.F/S/A/00252"
                                                        name="iiisla_number"
                                                        id="iiisla_number"
                                                        value={formik.values.iiisla_number}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.iiisla_number && formik.errors.iiisla_number}
                                                    />
                                                    <ErrorMessage name="iiisla_number" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <TextField variant="outlined" className="w-100" label="Remark" placeholder="Remark"
                                                        name="remark"
                                                        id="remark"
                                                        value={formik.values.remark}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.remark && formik.errors.remark}
                                                    />
                                                    <ErrorMessage name="remark" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-1 ">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                            <DatePicker label="Client Expiry Date" variant="outlined" className=' w-100 mb-4' format="DD-MM-YYYY"
                                                                name='clientExpiryDate'
                                                                id="clientExpiryDate"
                                                                value={clientExpiryDate ? clientExpiryDate : null}
                                                                onChange={(newValue) => setClientExpiryDate(newValue)}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>

                                            </div>
                                            <div className="col-12 d-flex justify-content-center">
                                                {names === "create" ? (
                                                    loading ? (<Loader />) : (<button className="btn btn-primary btn-md btn-block" type="submit">Create User</button>)
                                                ) : (
                                                    loading ? (<Loader />) : (<button className="btn btn-primary btn-md btn-block" type="submit">Update</button>)
                                                )}
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                            </div>
                        </div>
                    </div>
                </div >
                )}
            </div>
        </>
    )
}

export default Create_Edit_form
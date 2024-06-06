import Layout from '../Component/Layout'
import React, { useEffect, useState } from 'react'
import { Box, CardActions, CardContent, Button, TextField, Modal } from '@mui/material';
import '../Common/css/Modal.css'
import { toast } from 'react-toastify';
import { makeApi } from '../helper/MakeApi';
import Loader from '../Common/Loader';

const Department = () => {
    const [openDepartmentForm, setOpenDepartmentForm] = useState(false);
    const handleOpenForm = () => setOpenDepartmentForm(true);
    const handleCloseForm = () => setOpenDepartmentForm(false);
    const [departmentName, setDepartmentName] = useState("");
    const [departmentList, setDepartmentList] = useState([])
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await makeApi("post", "/v1/createdepartment", { d_name: departmentName });
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                toast.success(response.error.message)
                console.log("reposne", response);
                getDepartmentList();
                handleCloseForm();
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

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

    useEffect(() => {
        getDepartmentList()
    }, []);

    //function to delete department 
    const deleteDepartment = async (id) => {
        try {
            const response = await makeApi("post", "/v1/departmentdestroy", { id: id });
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                toast.success(response.error.message)
                getDepartmentList();
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Layout />
            <div className='"main-content app-content'>
                <div className="container-fluid d-flex justify-content-center align-items-center pt-5 flex-column">
                    <div className="container">
                        <div className="card p-3   mt-5  shadow-lg border-1 ">
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h4 className='fw-bold '>All Department</h4>
                                <Button sx={{ textAlign: 'end' }} variant="contained" className='text-cend' onClick={handleOpenForm} >Create Department</Button>
                            </div>

                            {loading ? <Loader /> : (
                                <div className='imulcrtlist table-responsive'>
                                    <table className="table table-hover  table-bordered">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Deparment Name</th>
                                                <th scope="col">Delete</th>
                                            </tr>
                                        </thead>
                                        {departmentList.map((item, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.d_name}</td>
                                                    <td><button className='btn btn-danger' onClick={() => deleteDepartment(item.id)}>Delete</button></td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                </div >

                <Modal open={openDepartmentForm} onClose={handleCloseForm}>
                    <Box className="boxStyle shadow" sx={{ border: '0', borderRadius: '10px' }}>
                        <h4 className='text-center mb-0'>Create Department</h4>
                        <form onSubmit={handleSubmit}>
                            <CardContent>
                                <TextField label="Department" placeholder="Department" variant="outlined" sx={{ width: '100%', }} id="setDepartmentName" name="setDepartmentName" onChange={(e) => setDepartmentName(e.target.value)} />
                            </CardContent>
                            <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {loading ? <Loader /> : <Button variant="contained" type='submit'>Create</Button>}
                            </CardActions>
                        </form>
                    </Box>
                </Modal>
            </div>
        </>
    )
}

export default Department
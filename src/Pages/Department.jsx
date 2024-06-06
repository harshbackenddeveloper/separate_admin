import Layout from '../Component/Layout'
import React, { useEffect, useState } from 'react'
import { Box, CardActions, CardContent, Button, TextField, Modal, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
        console.log("id", id)
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = departmentList.map((userData, index) => ({
        ...userData,
        id: index + 1,
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'd_name', headerName: 'Deparment Name', width: 200 },
        // { field: 'Delete', headerName: 'Delete', width: 150 },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 120,
            renderCell: (params) => (
                <Button variant="contained" color="error" onClick={() => deleteDepartment(params.row.id)}>Delete</Button>
            )
        }
    ];
    return (
        <>
            <Layout />
            <div className='main-content app-content'>
                <div className="container-fluid">
                    <div class="page-header d-flex justify-content-between align-items-center">
                        <h1 className='page-title'>All Department </h1>
                        <Button sx={{ textAlign: 'end' }} variant="" className='text-cend btn-primary' onClick={handleOpenForm} >Create Department</Button>
                    </div>
                    {loading ? <Loader /> :
                        (
                            <div className='card custom-card'>
                                <div class="card-header justify-content-between"> <div class="card-title"> Department List </div> </div>
                                <div className='card-body'>

                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.field}
                                                            align="left"
                                                            style={{ minWidth: column.width }}
                                                        >
                                                            {column.headerName}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row, index) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                                {columns.map((column) => {
                                                                    const value = row[column.field];
                                                                    return (
                                                                        <TableCell key={column.field} align="left">
                                                                            {column.renderCell ? column.renderCell({ row }) : value}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        component="div"
                                        count={departmentList.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </div>
                            </div>
                        )}
                </div>

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
import Layout from '../Component/Layout';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import '../Common/css/Modal.css';
import { useNavigate } from 'react-router-dom';
import { makeApi } from '../helper/MakeApi';
import Loader from '../Common/Loader';
import { ProperDateFormat } from '../helper/UserToken';

import { TableContainer, Table, TableBody, TableCell, TablePagination, TableRow, TableHead, Paper } from '@mui/material';

const AllUserList = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchResut, setSearchResult] = useState('');
    const [userStatus, setUserStatus] = useState('');

    const clearAllFilter = () => {
        setSearchResult('');
        setUserStatus('');
        getUserList();

    }
    const getUserList = async () => {
        try {
            // setLoading(true);
            const userList = await makeApi('post', '/v1/get/users', { serach_key: searchResut, stauts: userStatus });
            console.log("all user list", userList)
            if (userList.hasError === true) {
                toast.error(userList.error.message);
            } else {
                console.log("all user list", userList.data)
                setUser(userList.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            // setLoading(false);
        }
    };

    //Delete user function
    const DeleteUser = async (email) => {
        try {
            const deleteUser = await makeApi('post', "/v1/destoryUser", { email: email });
            if (deleteUser.hasError == true) {
                toast.error(deleteUser.error.message)
            } else {
                console.log("delete user ", deleteUser);
                toast.success('user deleted successfully');
                getUserList();
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserList();
    }, [searchResut, userStatus]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'surveyor_or_Firm_name', headerName: 'Surveyor Or Firm Name', width: 200 },
        { field: 'last_name', headerName: 'Last Name', width: 150 },
        { field: 'mobile', headerName: 'Mobile Number', width: 150 },
        { field: 'expiry_date', headerName: 'User Expiry', width: 150, renderCell: (params) => ProperDateFormat({ dateString: params.row.expiry_date }) },
        { field: 'link_limit', headerName: 'Link limit', width: 120 },
        { field: 'space', headerName: 'Space', width: 120 },
        {
            field: 'details',
            headerName: 'Details',
            width: 120,
            renderCell: (params) => (
                <Button variant="contained" color="primary" onClick={() => AllDetails(params.row.id)}>Details</Button>
            )
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button variant="contained" color="warning" onClick={() => navigate(`/form/${params.row.id}`)}>Edit</Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 120,
            renderCell: (params) => (
                <Button variant="contained" color="error" onClick={() => DeleteUser(params.row.email)}>Delete</Button>
            )
        }
    ];

    const AllDetails = (id) => {
        navigate(`/link/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = user.map((userData, index) => ({
        ...userData,
        id: index + 1, // Calculate serial number starting from 1
    }));

    return (
        <>
            <Layout />
            <div className='main-content app-content'>
                {loading ? <Loader /> : (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

                        <div>
                            <div>
                                <TextField label="search" value={searchResut} onChange={(e) => setSearchResult(e.target.value)} />
                            </div>
                            <div>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={userStatus}
                                        label="User Status"
                                        onChange={(e) => setUserStatus(e.target.value)}
                                    >
                                        <MenuItem value={'all'}></MenuItem>
                                        <MenuItem value={1}>Active</MenuItem>
                                        <MenuItem value={0}>InActive</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <Button onClick={() => clearAllFilter()}>Clear filter</Button>
                            </div>
                        </div>



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
                            count={user.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                )}
            </div>
        </>
    );
};

export default AllUserList;
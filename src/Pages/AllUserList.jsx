import Layout from '../Component/Layout';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, TableContainer, Table, TableBody, TableCell, TablePagination, TableRow, TableHead } from '@mui/material';
import { toast } from 'react-toastify';
import '../Common/css/Modal.css';
import { useNavigate } from 'react-router-dom';
import { makeApi } from '../helper/MakeApi';
import { ProperDateFormat } from '../helper/UserToken';

const AllUserList = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [userStores, setUserStores] = useState({});
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
            const userList = await makeApi('post', '/v1/get/users', { serach_key: searchResut, stauts: userStatus });
            console.log("all user list", userList)
            if (userList.hasError === true) {
                toast.error(userList.error.message);
            } else {
                setUser(userList.data);
            }
        } catch (error) {
            console.log(error);
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
        sno: index + 1,
    }));

    useEffect(() => {
        getUserList();
    }, [searchResut, userStatus]);

    useEffect(() => {
        // Fetch user store data for each user
        const fetchUserStores = async () => {
            const promises = user.map(async (user) => {
                try {
                    const response = await makeApi('post', "/v1/user/getstoragebyadmin", { user_id: user.id });
                    return { id: user.id, data: response?.data?.remainingspace };
                } catch (error) {
                    console.log(error);
                    return { id: user.id, data: null };
                }
            });

            Promise.all(promises).then((userStores) => {
                const userStoreMap = {};
                userStores.forEach((store) => {
                    userStoreMap[store.id] = store.data;
                });
                setUserStores(userStoreMap);
            });
        };

        fetchUserStores();
    }, [user])

    const columns = [
        { field: 'sno', headerName: 'sno', width: 70 },
        { field: 'surveyor_or_Firm_name', headerName: 'Surveyor Or Firm Name', width: 200 },
        { field: 'last_name', headerName: 'Last Name', width: 150 },
        { field: 'mobile', headerName: 'Mobile Number', width: 150 },
        { field: 'expiry_date', headerName: 'User Expiry', width: 150, renderCell: (params) => ProperDateFormat({ dateString: params.row.expiry_date }) },
        { field: 'link_limit', headerName: 'Link limit', width: 120, renderCell: (params) => <span>{params.row.link_limit} / {params.row.link_count}  </span> },
        { field: 'remaining_space', headerName: 'Space', width: 150, renderCell: (params) => userStores[params.row.id] !== undefined ? `${params.row.space} / ${userStores[params.row.id]} mb` : 'null' },
        {
            field: 'details', headerName: 'Details', width: 120, renderCell: (params) => {
                if (params && params.row && typeof params.row.status !== 'undefined') {
                    return (
                        <Button variant="contained" size="small" onClick={() => {
                            if (params.row.link_count >= 0) {
                                AllDetails(params.row.id)
                            }
                        }}
                            disabled={params.row.link_count <= 0} >
                            Details
                        </Button>
                    )
                }
            }
        },
        {
            field: 'edit', headerName: 'Edit', width: 100, renderCell: (params) => (
                <Button variant="contained" color="warning" size="small" onClick={() => navigate(`/form/${params.row.id}`)}>Edit</Button>
            )
        },
        {
            field: 'delete', headerName: 'Delete', width: 120, renderCell: (params) => (
                <Button variant="contained" color="error" size="small" onClick={() => DeleteUser(params.row.email)}>Delete</Button>
            )
        }
    ];

    return (
        <>
            <Layout />
            <div className='main-content app-content'>
                <div className='container-fluid'>
                    <div className="page-header"> <h1 className='page-title'>All User </h1>
                        <Button sx={{ textAlign: 'end' }} variant="contained" size="small" className='text-cend' onClick={() => navigate('/form/create')} >Create_User</Button>
                    </div>
                    <div className='card custom-card'>
                        <div className="card-header justify-content-between"> <div className="card-title"> User List </div> </div>

                        <div className='card-body'>
                            <div className='row mb-0 mb-md-3'>
                                <div className='col-12 col-md-4 mb-3 mb-lg-0'>
                                    <TextField className='w-100' label="search" value={searchResut} onChange={(e) => setSearchResult(e.target.value)} />
                                </div>
                                <div className='col-12 col-md-5 ms-auto'>
                                    <div className='row'>
                                        <div className='col-12 col-sm-9 mb-3 mb-lg-0'>
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
                                        <div className='col-12 col-sm-3 mb-3 mb-lg-0'>
                                            <Button className='btn btn-primary  btn-sm' size="small" onClick={() => clearAllFilter()}>Clear filter</Button>
                                        </div>
                                    </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllUserList;
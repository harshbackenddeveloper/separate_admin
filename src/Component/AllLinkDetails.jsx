import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useParams } from 'react-router-dom'
import { makeApi } from '../helper/MakeApi';
import { toast } from 'react-toastify';
import Loader from '../Common/Loader';
import { ProperDateFormat, userlocalStorageData } from '../helper/UserToken';
import ShowDocument from './ShowDocument';

import { TableContainer, Table, TableBody, TableCell, TablePagination, TableRow, TableHead, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AllLinkDetails = () => {
    const { userid } = useParams();
    const userToken = userlocalStorageData().userToken
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState('');

    const [userLink, setUserLink] = useState([]);
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [searchResut, setSearchResult] = useState('');
    const [userStatus, setUserStatus] = useState('');

    const clearAllFilter = () => {
        setSearchResult('');
        setUserStatus('');
        userLink();
    }

    const getUserLink = async () => {
        // setLoading(true)
        try {
            const response = await makeApi('post', "/v1/admin/getLinkById", { user_id: userid, serach_key: searchResut, stauts: userStatus });
            // console.log("user link respone ", response);
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                setUserLink(response.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            // setLoading(false)
        }
    }

    //function to show document 
    const showDocument = (id) => {
        setSelectedDocId(id);
        setShowImageModal(true);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = userLink.map((userLink, index) => ({
        ...userLink,
        id: index + 1,
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'link_name', headerName: 'Link Name', width: 200 },
        { field: 'link_url', headerName: 'Link Url', width: 150 },
        { field: 'created_at', headerName: 'Create Date', width: 150, renderCell: (params) => <ProperDateFormat dateString={params.row.created_at} /> },
        { field: 'expiry_date', headerName: 'Expiry Date', width: 150, renderCell: (params) => <ProperDateFormat dateString={params.row.expiry_date} /> },
        {
            field: 'show',
            headerName: 'Show',
            width: 120,
            renderCell: (params) => (
                <Button variant="contained" color="primary" onClick={() => showDocument(params.row.id)}>Show</Button>
            )
        },
    ];

    useEffect(() => {
        getUserLink();
    }, [searchResut, userStatus])
    return (
        <>
            <Layout />
            <div className='"main-content app-content'>
                {loading ? <Loader /> : (
                    <div className='container-fluid'>
                            <div class="page-header"> <h1 class="page-title">All Link </h1></div>
                        <div className='card custom-card'>
                            <div class="card-header justify-content-between"> <div class="card-title"> All List </div> </div>
                                <div className='card-body'>
                            <div className='row'>
                                <div className='col-12 col-md-4 mb-4 mb-sm-0'>
                                    <TextField className='w-100' label="search" value={searchResut} onChange={(e) => setSearchResult(e.target.value)} />
                                </div>
                                <div className='col-12 col-md-5 ms-auto'>
                                    <div className='row'>
                                        <div className='col-7 col-md-9'>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={userStatus}
                                                    label="Age"
                                                    onChange={(e) => setUserStatus(e.target.value)}
                                                >
                                                    <MenuItem value={'all'}></MenuItem>
                                                    <MenuItem value={1}>Active</MenuItem>
                                                    <MenuItem value={0}>InActive</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-5 col-md-3'>
                                            <Button onClick={() => clearAllFilter()} className='btn-primary h-100'>Clear filter</Button>
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
                                        className='pagination'
                                        rowsPerPageOptions={[5, 10, 15]}
                                        component="div"
                                        count={userLink.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </div>    
                        </div>        
                    </div>    
                )}

                {/* these popup is for showing images whichever user watnt to see */}
                {userToken ? (
                    <div>
                        <ShowDocument
                            open={showImageModal}
                            handleClose={() => setShowImageModal(false)}
                            id={selectedDocId}
                        />
                    </div>
                ) : navigate('/')}

            </div>
        </>
    )
}

export default AllLinkDetails
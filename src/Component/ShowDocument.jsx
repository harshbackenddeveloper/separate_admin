import { Box, Fade, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import '../Common/css/Modal.css'
import '../Common/css/Common.css';
import CloseIcon from '@mui/icons-material/Close';
import { makeApi } from '../helper/MakeApi';
import Loader from '../Common/Loader';

const ShowDocument = ({ open, handleClose, id }) => {
    const [loading, setLoading] = useState(false)
    const [docImg, setDocImg] = useState([]);

    const getDocumentByLinkId = async () => {
        try {
            setLoading(true)
            const link_id = { link_id: id };
            const response = await makeApi('post', '/v1/user/showDoc', link_id);
            console.log("response of img", response);
            if (response.hasError == true) {
                toast.error(response.error.message);
                setDocImg([]);
            } else {
                setDocImg(response?.data || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (open) {
            getDocumentByLinkId();
        }
    }, [open, id]);



    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    return (
        <>
            <Modal className='modal-lg' open={open} onClose={handleClose} closeAfterTransition            >
                <Fade in={open}>
                    <Box className="boxStyleShowDocument shadow border-0 rounded ">
                        <div className='d-flex justify-content-between'>
                            <h4 className='text-center fw-bold mb-3'>{docImg[0] && docImg[0].doc_name}</h4>
                            <CloseIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleClose()} />
                        </div>
                        {loading ? <Loader /> : (
                            docImg.length > 0 ? (<div>
                                <div className="table-responsive imupcrpopo">
                                    <table className="table table-hover table-bordered ">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Img</th>
                                                <th scope="col">Date/Time</th>
                                                <th scope="col">Latitude</th>
                                                <th scope="col">Longitude</th>
                                                <th scope="col">Uploaded At</th>
                                                <th scope="col">Downloaded At</th>
                                                <th scope="col">Deleted At</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {docImg.map((item, index) => (
                                                <tr key={item.id}>
                                                    <th scope="row" >{index + 1}</th>
                                                    <td>{item.is_deleted !== 1 ? <img style={{ height: '120px', width: '120px' }} src={"http://sharelink.clientdemobot.com/" + item.file} alt="Delete" /> : <h4 style={{ color: "red" }}>Deleted</h4>}</td>
                                                    <th scope="row" >Date: {formatDate(item.created_at)}, Time: {formatTime(item.created_at)}</th>
                                                    <th scope="row" >{item.latitude}</th>
                                                    <th scope="row" >{item.longitude}</th>
                                                    <th scope="row">Date: {formatDate(item.created_at)}, Time: {formatTime(item.created_at)}</th>
                                                    <th scope="row">{item.is_download === 1 ? `Date: ${formatDate(item.download_at)}, Time: ${formatTime(item.download_at)}` : ""}</th>
                                                    <th scope="row">{item.is_deleted === 1 ? `Date: ${formatDate(item.updated_at)}, Time: ${formatTime(item.updated_at)}` : ""}</th>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>

                            </div>) : (<h3 style={{ color: "red", textAlign: 'center' }}>Photo's are not available</h3>)
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default ShowDocument
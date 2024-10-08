import * as React from 'react';
import { useState, useEffect } from 'react';
import './TablesData.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import SendEmail from './sendEmail';

const fetchProgramData = async () => {
    try {
        const response = await fetch('https://herinitiative.or.tz/her-api/api/newsLetter/get_email.php', {
            method: 'GET',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching program data:', error);
        return [];
    }
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    maxWidth: '80vw',
    maxHeight: '80vh',
    overflowY: 'auto',
};

const filterSpecialCharacters = (str) => {
    return str.replace(/[^\w\s]/gi, '');
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function TablesData() {
    const [programData, setProgramData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal2 = () => setOpenModal2(true);
    const handleCloseModal2 = () => setOpenModal2(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchProgramData().then(setProgramData);
    }, []);

    const navigate = useNavigate();
    const handleClick1 = (path) => {
        navigate(path);
    };

    return (
        <>
            <div style={{ backgroundColor: 'black', width: '100%', height: '100px', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                <div style={{ marginRight: '50px' }}>
                    <img src="/logo192.png" alt="logo" width="150px" />
                </div>
                <Typography
                    variant="body1"
                    onClick={() => handleClick1('/home')}
                    style={{ marginRight: '20px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Blog
                </Typography>
                <Typography
                    variant="body1"
                    onClick={() => handleClick1('/reports')}
                    style={{ marginRight: '20px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Report
                </Typography>
                <Typography
                    variant="body1"
                    onClick={() => handleClick1('/success')}
                    style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Success Stories
                </Typography>
            </div>
            <div className='table-container'>
                <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px' }}>
                    <Button onClick={() => {
                        handleClose();
                        handleOpenModal2();
                    }} variant="contained" className="donationButton1">Send Email</Button>
                </div>
                {uploadStatus && (
                    <div style={{ backgroundColor: 'green', color: 'white', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
                        <Typography variant="body1" color={uploadStatus.includes('successfully') ? "success" : "error"}>
                            {uploadStatus}
                        </Typography>
                        <CloseIcon onClick={() => setUploadStatus(null)} style={{ cursor: 'pointer' }} />
                    </div>
                )}
                {programData.length !== 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: '100vw' }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">Email</StyledTableCell>
                                    <StyledTableCell align="left">Date Registered</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {programData.map((row) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {filterSpecialCharacters(row.email)}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.date}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <div>No data available</div>
                )}
                <Modal
                    open={openModal2}
                    onClose={handleCloseModal2}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Send Email?
                        </Typography>
                        <SendEmail handleCloseModal={handleCloseModal} setUploadStatus={setUploadStatus} uploadStatus={uploadStatus} />
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default TablesData;

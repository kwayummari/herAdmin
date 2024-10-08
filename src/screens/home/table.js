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
import Avatar from '@mui/material/Avatar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import EditBlogForm from '../admin/blogEdit';
import CloseIcon from '@mui/icons-material/Close';
import NewBlogForm from '../admin/blog';
import Preview from '../preview/preview';
import { useNavigate } from 'react-router-dom';

const fetchProgramData = async () => {
    try {
        const response = await fetch('https://herinitiative.or.tz/her-api/api/blog/get_blog.php', {
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
    const [rowData, setRowData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal1 = () => setOpenModal1(true);
    const handleCloseModal1 = () => setOpenModal1(false);
    const handleOpenModal2 = () => setOpenModal2(true);
    const handleCloseModal2 = () => setOpenModal2(false);
    const handleOpenModal3 = () => setOpenModal3(true);
    const handleCloseModal3 = () => setOpenModal3(false);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchProgramData().then(setProgramData);
    }, []);

    const deleteData = async (id) => {
        const formData = new FormData();
        formData.append('id', id);
        fetch('https://herinitiative.or.tz/her-api/api/blog/delete_blog.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setUploadStatus(data.message);
                handleCloseModal();
            })
            .catch(error => {
                console.error('Failed deleting:', error);
                setUploadStatus('Error deleting blog.');
            });
    };
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
                    onClick={() => handleClick1('/newsLetter')}
                    style={{ marginRight: '20px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    NewsLetter
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
                    }} variant="contained" className="donationButton1">Add Blog</Button>
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
                                    <StyledTableCell>Image</StyledTableCell>
                                    <StyledTableCell align="left">Title</StyledTableCell>
                                    <StyledTableCell align="left">Description</StyledTableCell>
                                    <StyledTableCell align="left">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {programData.map((row) => (
                                    <StyledTableRow key={row.id}>

                                        <StyledTableCell align="center">
                                            <Avatar alt={row.title} src={`https://herinitiative.or.tz/her-api/api/blog/images/${row.image}`} />
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {filterSpecialCharacters(row.title)}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.description}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <RemoveRedEyeIcon onClick={(event) => { setRowData(row); handleClick(event) }} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <div>No data available</div>
                )}
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        handleOpenModal();
                    }}>
                        <ListItemIcon>
                            <DriveFileRenameOutlineIcon fontSize="small" />
                        </ListItemIcon> Edit
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        handleOpenModal1();
                    }}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon> Delete
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        handleOpenModal3();
                    }}>
                        <ListItemIcon>
                            <RemoveRedEyeIcon fontSize="small" />
                        </ListItemIcon> Preview
                    </MenuItem>
                </Menu>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit News
                        </Typography>
                        <EditBlogForm rows={rowData} handleCloseModal={handleCloseModal} setUploadStatus={setUploadStatus} uploadStatus={uploadStatus} />
                    </Box>
                </Modal>
                <Modal
                    open={openModal1}
                    onClose={handleCloseModal1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Are you sure you want to delete this blog?
                        </Typography>
                        <Button onClick={() => deleteData(rowData.id)} variant="contained" fullWidth className="donationButton1">Delete</Button>
                    </Box>
                </Modal>
                <Modal
                    open={openModal2}
                    onClose={handleCloseModal2}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add Blog?
                        </Typography>
                        <NewBlogForm handleCloseModal={handleCloseModal} setUploadStatus={setUploadStatus} uploadStatus={uploadStatus} isStory={false} />
                    </Box>
                </Modal>
                <Modal
                    open={openModal3}
                    onClose={handleCloseModal3}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Preview id={rowData.id} link={'get_blog_byId.php'} title={'Our Blogs'} />
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default TablesData;

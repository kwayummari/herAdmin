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

function TablesData() {
    const [programData, setProgramData] = useState(null);

    useEffect(() => {
        fetchProgramData();
    }, []);

    const fetchProgramData = async () => {
        try {
            const response = await fetch('https://herinitiative.or.tz/her-api/api/blog/get_blog.php', {
                method: 'GET',
            });
            const data = await response.json();
            setProgramData(data);
        } catch (error) {
            console.error('Error fetching program data:', error);
        }
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
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">Title</StyledTableCell>
                            <StyledTableCell align="right">Description</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {programData.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell align="right"><img src={`https://herinitiative.or.tz/her-api/api/blog/images/${programs.image}`} /></StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                {filterSpecialCharacters(row.title)}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.description}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TablesData;

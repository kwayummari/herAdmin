import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SendEmail({ handleCloseModal, setUploadStatus, uploadStatus }) {
    const [message, setMessage] = useState('');
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await fetch('https://herinitiative.or.tz/her-api/api/newsLetter/get_email.php');
                const data = await response.json();
                const emailAddresses = data.map(item => item.email);
                setEmails(emailAddresses);
            } catch (error) {
                console.error('Error fetching emails:', error);
                setUploadStatus('Failed to fetch emails. Please try again.');
            }
        };

        fetchEmails();

        const userId = localStorage.getItem('userId');
        if (userId != 1) {
            handleClick('/admins');
        }
    }, []);

    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const responses = await Promise.all(
                emails.map(async (email) => {
                    const response = await fetch('https://herinitiative.or.tz/her-api/api/newsLetter/send_email.php', {
                        method: 'POST',
                        body: JSON.stringify({ to: email, message: message }),
                    });
                    return response.json();
                })
            );
            setUploadStatus('Emails sent successfully!');
        } catch (error) {
            console.error('Error sending emails:', error);
            setUploadStatus('Failed to send emails. Please try again.');
        }
    };

    return (
        <div>
            <div className="contents">
                <Card variant="elevation" elevation={3} className="contactCard">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Message"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ style: { color: 'black' } }}
                                InputProps={{ style: { color: 'black', border: '1px solid #000000' } }}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button type="submit" variant="contained" fullWidth className="donationButton1">Submit</Button>
                            {uploadStatus && <Typography variant="body1" color={uploadStatus.includes('successfully') ? "success" : "error"}>{uploadStatus}</Typography>}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SendEmail;

import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography, Checkbox, FormControlLabel } from '@mui/material';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import './style.css';
import { useNavigate } from 'react-router-dom';

function NewBlogForm({handleCloseModal, setUploadStatus, uploadStatus, isStory}) {
    const [title, setTitle] = useState('');
    const [editor, setEditor] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId != 1) {
            handleClick('/admins')
        }
    }, []);

    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const initializeEditor = () => {
            const editorElement = document.getElementById('editorjs');
            if (editorElement) {
                const editorInstance = new EditorJS({
                    holder: 'editorjs',
                    tools: {
                        header: Header,
                        list: List,
                        image: {
                            class: ImageTool,
                            config: {
                                uploader: {
                                    uploadByFile: async function (file) {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        const options = {
                                            method: 'POST',
                                            body: formData
                                        };
                                        const data = fetch('https://herinitiative.or.tz/her-api/api/blog/add_image.php', options)
                                            .then(response => {
                                                if (!response.ok) {
                                                    throw new Error('Network response was not ok');
                                                }
                                                return response.json();
                                            })
                                            .then(data => {
                                                return data;
                                            })
                                            .catch(error => {
                                                console.error('Upload failed:', error);
                                            });
                                        return data;

                                    }
                                },
                            }
                        }
                    },
                    onChange: async () => {
                        if (editorInstance) {
                            try {
                                const savedData = await editorInstance.save();
                                setEditor(savedData);
                                console.log('Editor content saved:', savedData);
                            } catch (error) {
                                console.error('Error saving editor content:', error);
                            }
                        }
                    }

                });
                setEditor(editorInstance);
                return () => {
                    if (editorInstance) {
                        editorInstance.destroy();
                    }
                };
            } else {
                setTimeout(initializeEditor, 100);
            }
        };

        initializeEditor();
    }, []);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('description', '');
        formData.append('category', isStory ? '1': '');
        formData.append('full_description', JSON.stringify(editor));

        fetch('https://herinitiative.or.tz/her-api/api/blog/add_blog.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setUploadStatus(data.message);
                handleCloseModal();
            })
            .catch(error => {
                console.log(error)
                setUploadStatus('Error uploading file.');
                handleCloseModal();
            });
    };

    return (
        <div>
            <div className="contents">
                <Card variant="elevation" elevation={3} className="contactCard">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ style: { color: 'black' } }}
                                InputProps={{ style: { color: 'black', border: '1px solid #000000' } }}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div
                                id="editorjs"
                                style={{
                                    color: 'black', border: '1px solid #000000',
                                    width: '97%', height: '50%', alignItems: 'center', borderRadius: '5px',
                                    paddingTop: '20px', paddingLeft: '20px', marginBottom: '20px'
                                }}
                            ></div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                InputLabelProps={{ style: { color: 'black' } }}
                                InputProps={{ style: { color: 'black', border: '1px solid #000000' } }}
                                style={{
                                    color: 'black', border: '1px solid #000000',
                                    width: '97%', height: '40px', alignItems: 'center', borderRadius: '5px',
                                    paddingTop: '20px', paddingLeft: '20px', marginBottom: '20px'
                                }}
                            />
                            <Button type="submit" variant="contained" fullWidth className="donationButton1">Submit</Button>
                            {uploadStatus && <Typography variant="body1" color={uploadStatus.includes('successfully') ? "success" : "error"}>{uploadStatus}</Typography>}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}

export default NewBlogForm;

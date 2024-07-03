import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import './style.css';
import { useNavigate } from 'react-router-dom';

function EditBlogForm({ rows, handleCloseModal, setUploadStatus, uploadStatus }) {
    const [editorInstance, setEditorInstance] = useState(null);
    const [title, setTitle] = useState(rows.title || '');
    const navigate = useNavigate();
    const handleClick = (path) => {
        navigate(path);
    };
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId != 1) {
            handleClick('/admins');
        }
    }, []);

    useEffect(() => {
        const initializeEditor = () => {
            const editorElement = document.getElementById('editorjs');
            if (editorElement) {
                const data = rows.full_description ? JSON.parse(rows.full_description) : { blocks: [] };
                const uniqueBlocks = Array.from(new Set(data.blocks.map(block => block.id)))
                    .map(id => data.blocks.find(block => block.id === id));
                data.blocks = uniqueBlocks;

                const editor = new EditorJS({
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
                                        const response = await fetch('https://herinitiative.or.tz/her-api/api/blog/add_image.php', options);
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        const data = await response.json();
                                        return {
                                            success: 1,
                                            file: {
                                                url: data.url
                                            }
                                        };
                                    }
                                },
                            }
                        }
                    },
                    data: data,
                    onReady: () => {
                        setEditorInstance(editor);
                    },
                    onChange: async () => {
                        const savedData = await editor.save();
                        setEditorInstance(savedData);
                        console.log('Editor content saved:', savedData);
                    }
                });

                return () => {
                    editor.isReady.then(() => {
                        editor.destroy();
                    }).catch((e) => console.error('ERROR editor cleanup', e));
                };
            }
        };

        initializeEditor();
    }, [rows.full_description]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let fullDescription = '';
        if (editorInstance) {
            fullDescription = await editorInstance.save();
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('id', rows.id);
        formData.append('full_description', JSON.stringify(fullDescription));

        fetch('https://herinitiative.or.tz/her-api/api/blog/edit_blog.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setUploadStatus(data.message);
                handleCloseModal();
            })
            .catch(error => {
                console.error('Failed editing:', error);
                setUploadStatus('Error Editing blog.');
            });
    };

    return (
        <div className="contentsEdit">
            <Card variant="elevation" elevation={3} className="contactCardEdit">
                <CardContent className="cardContentScrollable">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={title}
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{ style: { color: 'black', border: '1px solid #000000' } }}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div
                            id="editorjs"
                            style={{
                                color: 'black', border: '1px solid #000000',
                                width: '100%', alignItems: 'center', borderRadius: '5px',
                                paddingTop: '20px', marginBottom: '20px'
                            }}
                        ></div>
                        <Button type="submit" variant="contained" fullWidth className="donationButton1">Submit</Button>
                        {uploadStatus && <Typography variant="body1" color={uploadStatus.includes('successfully') ? "success" : "error"}>{uploadStatus}</Typography>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default EditBlogForm;

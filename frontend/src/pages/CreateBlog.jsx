import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../api/services';
import Layout from '../components/Layout';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await blogApi.create({ title, content, image_url: imageUrl });
            navigate('/');
        } catch (err) {
            console.error("Failed to create blog", err);
            setError(err.response?.data?.detail || 'Failed to create blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Write a New Story
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            label="Image URL (Optional)"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            helperText="Paste a URL for the cover image"
                        />

                        <TextField
                            label="Content"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            multiline
                            minRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/')}
                                sx={{ mr: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                            >
                                {loading ? 'Publishing...' : 'Publish'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </Layout>
    );
};

export default CreateBlog;

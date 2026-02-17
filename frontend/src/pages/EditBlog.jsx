import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { blogApi } from '../api/services';
import Layout from '../components/Layout';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await blogApi.getById(id);
                setTitle(data.title);
                setContent(data.content);
                setImageUrl(data.image_url || '');
            } catch (err) {
                console.error("Failed to fetch blog", err);
                setError('Failed to load blog data.');
            } finally {
                setFetching(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await blogApi.update(id, { title, content, image_url: imageUrl });
            navigate(`/blog/${id}`, { replace: true });
        } catch (err) {
            console.error("Failed to update blog", err);
            setError(err.response?.data?.detail || 'Failed to update blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Edit Story
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
                                onClick={() => navigate(`/blog/${id}`, { replace: true })}
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
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </Layout>
    );
};

export default EditBlog;

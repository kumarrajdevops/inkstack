import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button, Paper, Avatar, Divider, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../components/Layout';
import { blogApi, authApi } from '../api/services';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        blogApi.getById(id)
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blog", err);
                setError('Failed to load blog post.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (error || !blog) {
        return (
            <Layout>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                        Back to Home
                    </Button>
                    <Typography variant="h5" color="error">{error || 'Blog not found'}</Typography>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                    Back to Home
                </Button>

                <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
                    {blog.image_url && (
                        <Box
                            component="img"
                            src={blog.image_url}
                            alt={blog.title}
                            sx={{
                                width: '100%',
                                maxHeight: '400px',
                                objectFit: 'cover',
                                borderRadius: 2,
                                mb: 4,
                                boxShadow: 3
                            }}
                        />
                    )}

                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {blog.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            {blog.author?.username?.charAt(0).toUpperCase() || 'A'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {blog.author?.username || 'Unknown Author'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Published on {new Date(blog.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>

                        {/* Action Buttons for Author */}
                        {authApi.getCurrentUser()?.sub === blog.author?.username && (
                            <Box>
                                <Tooltip title="Edit Post">
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/edit/${blog.id}`)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Post">
                                    <IconButton
                                        color="error"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this post?')) {
                                                try {
                                                    await blogApi.delete(blog.id);
                                                    navigate('/');
                                                } catch (e) {
                                                    alert('Failed to delete');
                                                }
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ mb: 4 }} />


                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                        {blog.content}
                    </Typography>

                    {/* Comments Section Removed */}
                </Paper>
            </Container>
        </Layout>
    );
};

export default BlogDetail;

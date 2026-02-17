import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { authApi } from '../api/services';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authApi.signup(formData);
            // Auto login or redirect to login? Let's redirect to login for simplicity
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed');
        }
    };

    return (
        <Layout>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Sign Up
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            name="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Full Name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                Already have an account? Sign In
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
};

export default Signup;

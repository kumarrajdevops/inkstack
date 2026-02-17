import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { authApi } from '../api/services';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authApi.login(username, password);
            navigate('/');
        } catch (err) {
            console.error("Login failed", err);
            setError(err.response?.data?.detail || 'Invalid username or password');
        }
    };

    return (
        <Layout>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Sign in
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                Don't have an account? Sign Up
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
};

export default Login;

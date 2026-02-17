import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuth = authApi.isAuthenticated();
    const user = authApi.getCurrentUser();

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                    Inkstack
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    {isAuth ? (
                        <>
                            <Button color="inherit" component={Link} to="/new" sx={{ mr: 1 }}>New Post</Button>
                            <Button color="inherit" component={Link} to={`/profile/${user?.sub}`}>{user?.sub}</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="primary" variant="contained" component={Link} to="/signup" sx={{ ml: 1 }}>Signup</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

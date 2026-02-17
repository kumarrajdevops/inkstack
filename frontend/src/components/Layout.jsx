import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';
import ArchitectureFooter from './ArchitectureFooter';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
                {children}
            </Container>
            <ArchitectureFooter />
        </Box>
    );
};

export default Layout;

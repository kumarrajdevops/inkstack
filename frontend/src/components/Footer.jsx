import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { configApi } from '../api/services';

const Footer = () => {
    const [footerText, setFooterText] = useState('© 2024 Inkstack');

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const data = await configApi.getFooter();
                if (data && data.value) {
                    setFooterText(data.value);
                }
            } catch (error) {
                console.error("Failed to fetch footer config", error);
            }
        };

        fetchFooter();
    }, []);

    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {footerText}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {'Built with '}
                    <Link color="inherit" href="https://reactjs.org/">
                        React
                    </Link>
                    {' & '}
                    <Link color="inherit" href="https://fastapi.tiangolo.com/">
                        FastAPI
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;

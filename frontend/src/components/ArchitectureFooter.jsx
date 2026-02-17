import React, { useContext } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { ArchitectureContext } from '../context/ArchitectureContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ArchitectureFooter = () => {
    const { lastRequestStatus } = useContext(ArchitectureContext);

    const steps = [
        { label: "Frontend", highlight: true },
        { label: "Nginx", highlight: true },
        { label: "Backend", highlight: true },
        { label: "Redis", highlight: lastRequestStatus === 'HIT' },
        { label: "PostgreSQL", highlight: lastRequestStatus === 'MISS' }
    ];

    // Filter out Redis if it's a MISS, because the flow is Frontend -> API -> Backend -> Nginx -> DB
    // But wait, the user's MISS flow was: Frontend -> API -> Backend -> Nginx -> PostgreSQL
    // And HIT flow was: Frontend -> API -> Backend -> Nginx -> Redis -> PostgreSQL

    // Actually, usually it checks Redis first, then DB if miss. 
    // Visualization:
    // HIT: ... -> Redis (Green)
    // MISS: ... -> Redis (Miss) -> DB (Orange)

    // User requirement: "Highlight 'Redis' if X-Cache is HIT. Highlight 'DB' if X-Cache is MISS."
    // And the lists:
    // Miss: [Frontend, API, Backend, Nginx, PostgreSQL]  (Redis is skipped in the list?)
    // Hit: [Frontend, API, Backend, Nginx, Redis, PostgreSQL]

    // So if HIT, show Redis. If MISS, hide Redis? Or show Redis as skipped?
    // User's specific example for MISS flow didn't include Redis in the list.
    // Let's interpret strictly: 
    // If HIT -> Show Redis (Highlighted), DB (Normal/Dimmed? Or DB is shown?)
    // User hit flow: ... -> Redis -> PostgreSQL. (Why Postgres if Redis hit? Maybe async write back? Or just Architecture diagram?)
    // Let's stick to the User's example lists.

    // Flow: Frontend -> Nginx -> Backend -> Redis (Check) -> DB (if miss)
    const missFlow = ["Frontend", "Nginx", "Backend", "Redis", "PostgreSQL"];
    const hitFlow = ["Frontend", "Nginx", "Backend", "Redis", "PostgreSQL"];

    const currentFlow = lastRequestStatus === 'HIT' ? hitFlow : missFlow;

    const isHighlighted = (step) => {
        if (lastRequestStatus === 'HIT' && step === 'Redis') return true;
        if (lastRequestStatus === 'MISS' && step === 'PostgreSQL') return true;
        return false;
    };

    return (
        <Box sx={{
            bgcolor: '#001e3c', // MUI Dark Blue
            color: 'white',
            py: 2,
            mt: 'auto',
            borderTop: 1,
            borderColor: '#132f4c',
            textAlign: 'center'
        }}>
            <Typography variant="overline" sx={{ color: '#66b2ff', mb: 1, display: 'block', letterSpacing: 2, fontWeight: 'bold' }}>
                LIVE ARCHITECTURE &nbsp;
                <Typography component="span" variant="caption" sx={{ color: lastRequestStatus === 'HIT' ? '#4caf50' : lastRequestStatus === 'MISS' ? '#ff9800' : '#b2bac2' }}>
                    ({lastRequestStatus === 'HIT' ? 'CACHE HIT' : lastRequestStatus === 'MISS' ? 'CACHE MISS' : 'IDLE'})
                </Typography>
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                divider={<ArrowForwardIcon sx={{ fontSize: 14, color: '#484f58', alignSelf: 'center' }} />}
            >
                {currentFlow.map((step, index) => (
                    <Chip
                        key={index}
                        label={step}
                        size="small"
                        sx={{
                            bgcolor: isHighlighted(step) ? (step === 'Redis' ? '#238636' : '#9e6a03') : 'transparent',
                            color: isHighlighted(step) ? 'white' : '#c9d1d9',
                            borderColor: isHighlighted(step) ? 'transparent' : '#30363d',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            fontWeight: isHighlighted(step) ? 'bold' : 'normal'
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default ArchitectureFooter;

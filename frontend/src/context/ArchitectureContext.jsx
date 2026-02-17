import React, { createContext, useState, useEffect } from 'react';

export const ArchitectureContext = createContext({
    lastRequestStatus: 'NONE', // 'HIT', 'MISS', or 'NONE'
    updateStatus: () => { }
});

export const ArchitectureProvider = ({ children }) => {
    const [lastRequestStatus, setLastRequestStatus] = useState('NONE');

    useEffect(() => {
        const handleStatusUpdate = (event) => {
            if (event.detail && event.detail.status) {
                setLastRequestStatus(event.detail.status);
            }
        };

        window.addEventListener('architecture-flow-update', handleStatusUpdate);

        return () => {
            window.removeEventListener('architecture-flow-update', handleStatusUpdate);
        };
    }, []);

    return (
        <ArchitectureContext.Provider value={{ lastRequestStatus }}>
            {children}
        </ArchitectureContext.Provider>
    );
};

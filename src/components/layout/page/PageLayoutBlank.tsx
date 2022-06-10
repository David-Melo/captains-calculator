import React from 'react';
import { Box } from '@mantine/core';

const PageLayoutBlank: React.FC = ({ children }) => {
    return (
        <Box
            sx={{
                height: '100%',
            }}
        >

            {children}

        </Box>
    )
}

export default PageLayoutBlank;
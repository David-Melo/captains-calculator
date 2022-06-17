import React from 'react';
import { Box, Button, Modal, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Icon } from '@iconify/react';
import Icons from 'components/ui/Icons';

const RecipeLinkModal = () => {

    const [opened, setOpened] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setOpened(true)
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Introduce yourself!"
                withinPortal 
            >
                {/* Modal content */}
            </Modal> 

            <Box
                onClick={handleClick}
                sx={theme => ({
                    width: 28,
                    height: 28,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.white,
                    borderRadius: theme.radius.sm,
                    boxShadow: theme.shadows.sm,
                    cursor: "default",
                    '&:hover': {
                        backgroundColor: theme.colors.gray[2],
                    }
                })}
            >
                <Icon icon={Icons.add} />
            </Box>

        </>
    );
};

export default RecipeLinkModal;
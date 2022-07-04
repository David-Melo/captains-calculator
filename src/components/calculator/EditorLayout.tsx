import { Box } from '@mantine/core';
import { SetupBar } from './SetupBar';
import { EditorWrapper } from './Editor';
import { ResultsSummary } from './ResultsSummary';

export const EditorLayout = () => {

    return (
        <Box
            sx={theme => ({
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '300px 1fr 300px',
                gridColumnGap: 0,
                gridRowGap: 0
            })}
        >
            <Box
                p="md"
                sx={theme => ({ backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[1] : theme.colors.dark[7]  })}
            >
                <SetupBar />
            </Box>
            <Box sx={theme => ({
                borderRight: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[8]}`,
                borderLeft: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[8]}`,
                backgroundColor: theme.colorScheme === 'light' ? theme.colors.white : theme.colors.dark[7],
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url("/img/${theme.colorScheme==='light'?'squared-metal.png':'squared-metal-inverted.png'}")`
                }
            })}>
                <EditorWrapper />
            </Box>
            <Box
                sx={theme => ({ backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[1] : theme.colors.dark[7]  })}
            >
                <ResultsSummary />
            </Box>
        </Box>
    );
}
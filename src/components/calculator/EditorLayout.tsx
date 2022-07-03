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
                sx={theme => ({ backgroundColor: theme.colors.gray[1] })}
            >
                <SetupBar />
            </Box>
            <Box sx={theme => ({
                borderRight: `1px solid ${theme.colors.gray[4]}`,
                borderLeft: `1px solid ${theme.colors.gray[4]}`,
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/squared-metal.png")'
                }
            })}>
                <EditorWrapper />
            </Box>
            <Box
                sx={theme => ({ backgroundColor: theme.colors.gray[1] })}
            >
                <ResultsSummary />
            </Box>
        </Box>
    );
}
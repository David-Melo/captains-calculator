import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { ColorSchemeProvider, Global, MantineProvider } from '@mantine/core';
import { createOvermind } from 'overmind'
import { Provider as StateProvider } from 'overmind-react'
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';

import App from './App';

import { AppStateConfig, useActions, useAppState } from 'state'
import theme from 'theme/theme';

import 'theme/scss/index.scss';

const overmind = createOvermind(AppStateConfig, {
    devtools: true
})

// background-color: #f1f3f5;
// background-image: url("https://www.transparenttextures.com/patterns/graphy.png");
// /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */

// background-color: #f1f3f5;
// background-image: url("https://www.transparenttextures.com/patterns/graphy.png");
// /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */

// background-color: #f1f3f5;
// background-image: url("https://www.transparenttextures.com/patterns/graphy.png");
// /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */

// background-color: #f1f3f5;
// background-image: url("https://www.transparenttextures.com/patterns/graphy.png");
// /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */

// background-color: #f1f3f5;
// background-image: url("https://www.transparenttextures.com/patterns/graphy.png");
// /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */


const Root = () => {

    const { theme: colorScheme } = useAppState().settings
    const { toggleColorScheme } = useActions()

    let currentTheme = {
        ...theme,
        colorScheme
    }

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
                theme={currentTheme}
                withNormalizeCSS
                withGlobalStyles
                defaultProps={{
                    Container: {
                        sizes: {
                            xs: 300,
                            sm: 720,
                            md: 960,
                            lg: 1140,
                            xl: 1320,
                        },
                    },
                }}
                styles={{
                    Modal: theme=>({
                        modal: { 
                            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[7]
                        }
                    }),
                    Drawer: theme=>({
                        drawer: {
                            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[7],
                            height: '100%',
                            minHeight: '100%',
                            maxHeight: '100%'
                        },
                        header: {
                            borderBottom: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[5]}`,
                            marginBottom: 0,
                            padding: theme.spacing.xl
                        }
                    })
                }}
            >
                <ModalsProvider>
                    <Global
                        styles={(theme) => ({
                            '::placeholder': {
                                color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.black
                            },
                            'input:-webkit-autofill': {
                                color: theme.colorScheme === 'dark' ? theme.colors.dark[3] + ' !important' : theme.black,
                                WebkitTextFillColor: theme.colorScheme === 'dark' ? theme.colors.dark[0] + ' !important' : theme.black,
                                fontFamily: "'Euclid Circular B'",
                                WebkitBoxShadow: `0 0 0px 1000px ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.white} inset`,
                                transition: 'background-color 5000s ease-in-out 0s'
                            },
                            body: {
                                ...theme.fn.fontStyles(),
                                background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
                                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                                lineHeight: theme.lineHeight
                            },
                            ' .react-flow__minimap-mask': {
                                fill: theme.colorScheme === 'dark' ? 'rgba(26, 27, 30, 0.7)' : 'rgba(240, 242, 243, 0.7)'
                            },
                            ' .react-flow__minimap': {
                                backgroundColor: theme.colorScheme === 'dark' ? '#141517' : '#FFFFFF'
                            },
                            ' .react-flow__controls-button': {
                                background: theme.colorScheme === 'dark' ? '#25262b' : '#fefefe',
                                borderBottom: theme.colorScheme === 'dark' ? '1px solid #141517' : '#eee',
                            },
                            ' .react-flow__controls-button svg': {
                                fill: theme.colorScheme === 'dark' ? '#c1bab5' : '#000000'
                            },
                            ' .react-flow__minimap-node': {
                                fill: theme.colorScheme === 'dark' ? 'rgba(26, 27, 30, 0.7)' : 'rgba(240, 242, 243, 0.7)',
                                stroke: theme.colorScheme === 'dark' ? 'rgb(85, 85, 85)' : 'rgb(85, 85, 85)'
                            }
                        })}
                    />
                    <NotificationsProvider position="bottom-left">
                        <App />
                    </NotificationsProvider>
                </ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    )
}

ReactDOM.render(
    <StateProvider value={overmind}>
        <Root />
    </StateProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
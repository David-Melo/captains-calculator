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
                        })}
                    />
                    <NotificationsProvider position="top-right">
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
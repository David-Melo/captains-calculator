
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { showNotification } from '@mantine/notifications';

import { useAppState } from 'state';

import Loader from 'components/app/Loader';
import AppShellLayout from 'components/layout/AppShellLayout';
import NavContext, { NavContextType } from 'components/navigation/NavContext';

import guestRoutes from 'routes/Guest'
import { Box, List, Text } from '@mantine/core';

const Wrapper = () => {

    const loading = useAppState(({ loading }) => loading)

    if (loading) return <Loader />

    return (
        <Routes>
            <Route path="*" element={<AppShellLayout />} />
        </Routes>
    )
}

const App: React.FC = () => {

    let [routes] = React.useState<NavContextType>(guestRoutes)

    React.useEffect(() => {
        showNotification({
            title: 'Release Notes',
            autoClose: 10000,
            disallowClose: true,
            message:
                <Box> 
                    <Box>
                        <Text weight={600}>v0.0.3</Text>
                        <List size="sm">
                            <List.Item>
                                Adds Ability To Delete Nodes
                                <List withPadding listStyleType="disc" size="xs">
                                    <List.Item>Feature is experimental, please report any bugs or crashes</List.Item>
                                </List>
                            </List.Item> 
                        </List>
                    </Box>
                    <Box>
                        <Text weight={600}>v0.0.2</Text>
                        <List size="sm">
                            <List.Item>Adds Storages as Import Sources</List.Item>
                            <List.Item>
                                Dark Mode Option Added
                                <List withPadding listStyleType="disc" size="xs">
                                    <List.Item>Might conflict with browser dark mode settings</List.Item>
                                    <List.Item>Please report if this happens to you</List.Item>
                                </List>
                            </List.Item>
                        </List>
                    </Box>
                </Box>
        })
    }, [])

    return (
        <NavContext.Provider value={routes}>
            <BrowserRouter>
                <Wrapper />
            </BrowserRouter>
        </NavContext.Provider>
    );
}

export default App;  
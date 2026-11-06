
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import { useActions, useAppState } from 'state';
import { Alert, Button, Container, Stack } from '@mantine/core';

import Loader from 'components/app/Loader';
import AppShellLayout from 'components/layout/AppShellLayout';
import NavContext, { NavContextType } from 'components/navigation/NavContext';

import guestRoutes from 'routes/Guest'

const Wrapper = () => {

    const { loading, initializationError } = useAppState();
    const { onInitializeOvermind } = useActions();

    if (loading) return <Loader />

    if (initializationError) return (
        <Container size="sm" py="xl">
            <Stack>
                <Alert title="Could not load calculator" color="red" role="alert">
                    {initializationError}
                </Alert>
                <Button onClick={() => void onInitializeOvermind()}>Try again</Button>
            </Stack>
        </Container>
    );

    return (
        <Routes>
            <Route path="*" element={<AppShellLayout />} />
        </Routes>
    )
}



const App: React.FC = () => {

    let [routes] = React.useState<NavContextType>(guestRoutes)

    return (
        <NavContext.Provider value={routes}>
            <BrowserRouter>
                <Wrapper />
            </BrowserRouter>
        </NavContext.Provider>
    );
}

export default App;

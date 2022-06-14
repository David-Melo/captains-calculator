
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAppState } from 'state';

import Loader from 'components/app/Loader';
import AppShellLayout from 'components/layout/AppShellLayout';
import NavContext, { NavContextType } from 'components/navigation/NavContext';

import guestRoutes from 'routes/Guest'

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

    return (
        <NavContext.Provider value={routes}>
            <BrowserRouter>
                <Wrapper />
            </BrowserRouter>
        </NavContext.Provider>
    );  
}

export default App; 
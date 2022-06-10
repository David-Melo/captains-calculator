
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAppState } from 'state';

import Loader from 'components/app/Loader';
import AppShellLayout from 'components/layout/AppShellLayout';
import NavContext from 'components/navigation/NavContext';

import guestRoutes from 'routes/Guest'

const App: React.FC = () => {

    let loading = useAppState().loading

    if (loading) {
        return <Loader />
    }

    return (
        <NavContext.Provider value={guestRoutes}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<AppShellLayout />} />
                </Routes>
            </BrowserRouter>
        </NavContext.Provider>
    ); 
}

export default App;
import React, { Suspense } from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

import useAuthContext from "./context/AuthContext";

import PrivateAdmin from "./components/auth/PrivateAdmin";

//= ======== prime react ========
// import "primereact/resources/primereact.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";

import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";

// const NewLoginPage = React.lazy(() => import("./components/auth/NewLoginPage"));
import NewLoginPage from "./components/auth/NewLoginPage";

function App() {
    const { user, getUserQuery, isLoading } = useAuthContext();
    return (
        <>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
                <Route path="/*" element={<PrivateAdmin />} />
                <Route path="/login" element={getUserQuery?.data?.data ? <Navigate to="/dashboard" /> : <NewLoginPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            {/* </Suspense> */}
        </>
    );
}

export default App;

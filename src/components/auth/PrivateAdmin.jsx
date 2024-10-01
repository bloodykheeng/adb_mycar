import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAuthContext from "../../context/AuthContext";
import AdminLayout from "../../layouts/AdminLayout";

const PrivateAdmin = ({ children }) => {
    const { user, getUserQuery, isLoading } = useAuthContext();
    const navigate = useNavigate();
    return getUserQuery?.isLoading ? (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh", // Full viewport height
                }}
            >
                <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
            </div>
        </>
    ) : getUserQuery?.data?.data ? (
        <AdminLayout />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateAdmin;

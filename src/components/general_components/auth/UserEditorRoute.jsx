import React from "react";
import { Container } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth/auth-api";
// import Navigation from '../common/Navigation'
// import { Footer } from '../common/Footer'

const UserEditorRoute = () => {
    // let navigate = useNavigate();
    if (!isAuthenticated()) {
        // navigate("/");
        return false;
    }

    const user = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

    //Check user permissions to redirect user if not admin
    if (!user?.permissions.includes("edit users")) {
        // navigate("/");
        return false;
    }

    // return user?.permissions.includes("edit users");
    return user?.role == "Supervisor";
};

export default UserEditorRoute;

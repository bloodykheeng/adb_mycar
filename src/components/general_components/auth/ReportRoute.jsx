import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth/auth-api";
// import Navigation from '../common/Navigation'
// import { Footer } from '../common/Footer'

const ReportRoute = () => {
    // let navigate = useNavigate();

    if (!isAuthenticated()) {
        // navigate("/");
        return false;
    }

    const user = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

    //Check user permissions to redirect user if not admin
    if (!(user?.permissions.includes("edit reports") || user?.permissions.includes("add reports"))) {
        // navigate("/");
        return false;
    }

    // return (
    //   user?.permissions.includes("edit reports") ||
    //   user?.permissions.includes("add reports")
    // );
    return user?.role == "Standard User";
};

export default ReportRoute;

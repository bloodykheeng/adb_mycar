import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth/auth-api";
// import Navigation from '../common/Navigation'
// import { Footer } from '../common/Footer'

const ApproverRoute = () => {
    // let navigate = useNavigate();
    if (!isAuthenticated()) {
        // navigate("/");
        return false;
    }

    const approverRoles = ["Standard User", "Supervisor", "Admin", "Manager", "Commissioner"];

    const user = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

    //Check user permissions to redirect user if not Approver
    if (!approverRoles.includes(user?.role)) {
        // navigate("/");
        return false;
    }

    return approverRoles.includes(user?.role);
};

export default ApproverRoute;

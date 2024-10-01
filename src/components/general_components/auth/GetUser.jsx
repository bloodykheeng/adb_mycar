import React from "react";
import { Container } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth/auth-api";

const GetUser = () => {
    //   if (!isAuthenticated()) return <Navigate to="/login" replace />;
    if (!isAuthenticated()) {
        return false;
    }
    const user = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;
    console.log("curent user is : ", user);
    return user;
};

export default GetUser;

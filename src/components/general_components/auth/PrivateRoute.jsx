import React from "react";
import { Container } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth/auth-api";
// import Navigation from '../common/Navigation'
// import { Footer } from '../common/Footer'

// const PrivateRoute = ({ children }) => {
//   if (!isAuthenticated()) return <Navigate to="/login" replace />
//   const user = localStorage.getItem('profile')
//     ? JSON.parse(localStorage.getItem('profile'))
//     : undefined
//   return isAuthenticated()
// }

const PrivateRoute = () => {
    // if (!isAuthenticated()) return false;
    // const user = localStorage.getItem("profile")
    //   ? JSON.parse(localStorage.getItem("profile"))
    //   : undefined;
    return isAuthenticated();
};

export default PrivateRoute;

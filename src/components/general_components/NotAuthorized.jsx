import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import NoUser from "./lotties/usernotfound.json";
const NotAuthorized = () => {
    const navigate = useNavigate();
    return (
        <>
            <Container>
                <center className="mt-5">
                    <h1>404: You are not authorized to continue</h1>
                    <small>Your session may have expired</small>
                    <div style={{ width: "30%" }}>
                        <Lottie animationData={NoUser} loop={true} autoplay={true} />
                    </div>
                    <Button onClick={() => navigate("/")}>First Log In Please !</Button>
                </center>
            </Container>
        </>
    );
};

export default NotAuthorized;

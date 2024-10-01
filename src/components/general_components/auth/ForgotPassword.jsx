import React, { useState } from "react";
import styled from "styled-components";
import * as Components from "./styles/Components";
import { useNavigate } from "react-router-dom";
import { obtainToken } from "../../../services/auth/auth-api";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import Lottie from "lottie-react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";

import WaterAndEnviromentData from "./lottiefiles/WaterAndEnviroment.json";
import WaterLoading from "./lottiefiles/WaterLoading.json";
import ForgotPasswordlotie from "./lottiefiles/ForgotPassword.json";

function ForgotPassword() {
    const [signIn, toggle] = React.useState(false);
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rpassword, setRpassword] = useState("");
    const [rpasswordType, setRpasswortType] = useState("");
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordType, setPasswordType] = useState("password");

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password");
    };

    const toggleRPassword = () => {
        if (rpasswordType === "password") {
            setRpasswortType("text");
            return;
        }
        setRpasswortType("password");
    };

    const handleSubmit = async (event) => {
        setShow(true);
        setMessage("");
        // toggle(false);
        const form = event.currentTarget;
        let invalid = false;
        event.preventDefault();
        if (form.checkValidity() === false) {
            //event.preventDefault();
            event.stopPropagation();
            invalid = true;
        }
        if (!username || !password) {
            setMessage("Invalid empty fields");
            setTimeout(() => setMessage(""), 5000);
        } else if (password !== rpassword) {
            setMessage("password mismatch");
            setTimeout(() => setMessage(""), 5000);
        } else {
            setLoading(true);
            if (invalid === false) {
                console.log("Form Submitted");
                // await obtainToken(username, password)
                //   .then((response) => {
                //     setLoading(true);
                //     navigate("/");
                //     window.location.reload();
                //   })
                //   .catch((error) => {
                //     setLoading(false);
                //     setMessage("Invalid Username or Password!");
                //     setTimeout(() => setMessage(""), 5000);
                //     setShow(true);
                //     console.log(error);
                //   });
            }
        }
    };

    return (
        <section className="app-intro app-sec vh-100 w-100">
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Components.Container>
                    <Components.SignUpContainer signinIn={signIn}>
                        <Components.Form>
                            <Components.Title>Reset password</Components.Title>
                            {loading && (
                                <div style={{ width: "100%" }}>
                                    <Lottie animationData={WaterLoading} loop={true} autoplay={true} />
                                </div>
                            )}
                            {show && <p style={{ dispaly: "block", padding: "10px", color: "red" }}>{message}</p>}
                            <PasswordInput>
                                <input value={password} placeholder="enter new Password" type={passwordType} onChange={handlePasswordChange} />
                                <div onClick={togglePassword}>{passwordType === "password" ? <VisibilityOffIcon /> : <VisibilityIcon />}</div>
                            </PasswordInput>

                            <PasswordInput>
                                <input value={rpassword} placeholder="Repeat Password" type={rpasswordType} onChange={(e) => setRpassword(e.target.value)} />
                                <div onClick={toggleRPassword}>{rpasswordType === "password" ? <VisibilityOffIcon /> : <VisibilityIcon />}</div>
                            </PasswordInput>

                            <Components.Button onClick={handleSubmit}>Submit</Components.Button>
                            <Link to="/login">
                                <h5
                                    style={{
                                        cursor: "pointer",
                                        color: "#04619f",
                                        marginTop: "1rem",
                                    }}
                                >
                                    back
                                </h5>
                            </Link>
                        </Components.Form>
                    </Components.SignUpContainer>

                    <Components.OverlayContainer signinIn={signIn}>
                        <Components.Overlay signinIn={signIn}>
                            <Components.LeftOverlayPanel signinIn={signIn}>
                                <div className="img-box">
                                    <img style={{ height: "150px" }} src="images/coatOfArms.png" alt="home-img" />
                                </div>
                                <h3>Ministry Of Water and Enviroment</h3>

                                <div style={{ width: "100%" }}>
                                    <Lottie animationData={WaterAndEnviromentData} loop={true} autoplay={true} />
                                </div>
                            </Components.LeftOverlayPanel>
                        </Components.Overlay>
                    </Components.OverlayContainer>
                </Components.Container>
            </div>
        </section>
    );
}

export default ForgotPassword;

const PasswordInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 90%;
    div {
        width: 3rem;
        background-color: #eee;
        height: 75%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        cursor: pointer;
    }
    input {
        background-color: #eee;
        border: none;
        padding: 12px 15px;
        margin: 8px 0;
        width: 100%;
        color: black;
    }
    input:focus {
        outline: none;
    }
`;

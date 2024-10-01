import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { obtainToken } from "../../../services/auth/auth-api";

export default function LoginPage() {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        let invalid = false;
        event.preventDefault();
        if (form.checkValidity() === false) {
            //event.preventDefault();
            event.stopPropagation();
            invalid = true;
        }
        setLoading(true);
        if (invalid === false) {
            console.log("Form Submitted");
            await obtainToken(username, password)
                .then((response) => {
                    setLoading(true);
                    navigate("/");
                    window.location.reload();
                })
                .catch((error) => {
                    setLoading(false);
                    setMessage("Invalid Username or Password!");
                    setShow(true);
                    console.log(error);
                });
        }
    };
    return (
        <>
            <section className="app-intro app-sec vh-100 w-100">
                <div className="app-sec-wrap container d-flex align-items-center">
                    <Form onSubmit={handleSubmit} className="form-signin bg-light p-5 border">
                        {loading && <p>Loading Please Wait...</p>}
                        {show && (
                            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                                <p>{message}</p>
                            </Alert>
                        )}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="floatingInput" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="floatingInput" />
                        </Form.Group>

                        <Button type="submit" className="w-auto py-2 px-5 btn btn-lg btn-primary">
                            Sign In
                        </Button>

                        <div className="mt-5 mb-3 text-muted border-top pt-4">
                            <ul className="nav p-0 m-0 justify-content-center">
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Form>
                </div>
            </section>
        </>
    );
}

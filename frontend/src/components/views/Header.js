import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigateTo = useNavigate();

    const handleNavigate = (path) => {
        navigateTo(path);
    };

    return (
        <Navbar bg="light" expand="lg">
            <Nav
                className="mr-auto"
                style={{ width: "50%", textAlign: "center" }}
            >
                <Nav.Link
                    onClick={() => handleNavigate("/")}
                    style={{ width: "100%" }}
                >
                    Home
                </Nav.Link>
            </Nav>
            <Nav
                className="ml-auto"
                style={{ width: "50%", textAlign: "center" }}
            >
                <Nav.Link
                    onClick={() => handleNavigate("/bookings")}
                    style={{ width: "100%" }}
                >
                    Bookings
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default Header;

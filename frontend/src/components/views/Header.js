import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigateTo = useNavigate();

    return (
        <Navbar bg="light" expand="lg">
            <Nav
                className="mr-auto"
                style={{ width: "50%", textAlign: "center" }}
            >
                <Nav.Link
                    onClick={() => navigateTo("/")}
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
                    onClick={() => navigateTo("/reservations")}
                    style={{ width: "100%" }}
                >
                    Reservations
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default Header;

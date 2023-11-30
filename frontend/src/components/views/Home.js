import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import RouteForm from "../utils/RouteForm";

function Home() {
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        const getPlanets = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-planets`
                );
                if (response.ok) {
                    const data = await response.json();
                    setPlanets(data);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getPlanets();
    }, []);

    return (
        <div className="space-theme">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1 className="text-center mb-4">
                            Intergalactic Transportation
                        </h1>
                        <RouteForm planets={planets}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;

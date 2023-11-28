import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function RouteForm({ planets }) {
    const [originPlanet, setOriginPlanet] = useState("");
    const [destinationPlanet, setDestinationPlanet] = useState("");

    const switchInputs = () => {
        const temp = originPlanet;
        setOriginPlanet(destinationPlanet);
        setDestinationPlanet(temp);
    };

    return (
        <Form>
            <Form.Group controlId="originPlanet">
                <Form.Label>Origin Planet</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter origin planet"
                    list="originPlanets"
                    value={originPlanet}
                    onChange={(event) => setOriginPlanet(event.target.value)}
                />
                {planets.length > 0 && (
                    <datalist id="originPlanets">
                        {planets.map(
                            (planet) =>
                                originPlanet
                                    .toLowerCase()
                                    .startsWith(
                                        planet.name.toLowerCase().charAt(0)
                                    ) && (
                                    <option
                                        key={planet.id}
                                        value={planet.name}
                                    />
                                )
                        )}
                    </datalist>
                )}
            </Form.Group>
            <br></br>

            <div className="text-center">
                <Button
                    variant="dark"
                    className="switch-button"
                    onClick={switchInputs}
                >
                    ↕
                </Button>
            </div>

            <Form.Group controlId="destinationPlanet" className="mt-3">
                <Form.Label>Destination Planet</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter destination planet"
                    list="destinationPlanets"
                    value={destinationPlanet}
                    onChange={(event) =>
                        setDestinationPlanet(event.target.value)
                    }
                />
                {planets.length > 0 && (
                    <datalist id="destinationPlanets">
                        {planets.map(
                            (planet) =>
                                destinationPlanet
                                    .toLowerCase()
                                    .startsWith(
                                        planet.name.toLowerCase().charAt(0)
                                    ) && (
                                    <option
                                        key={planet.id}
                                        value={planet.name}
                                    />
                                )
                        )}
                    </datalist>
                )}
            </Form.Group>

            <Button variant="dark" className="mt-4" block>
                Find Route
            </Button>
        </Form>
    );
}

export default RouteForm;

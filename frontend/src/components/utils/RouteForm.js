import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function RouteForm({ planets }) {
    const [originPlanet, setOriginPlanet] = useState("");
    const [destinationPlanet, setDestinationPlanet] = useState("");

    const navigateTo = useNavigate();

    const switchInputs = () => {
        const temp = originPlanet;
        setOriginPlanet(destinationPlanet);
        setDestinationPlanet(temp);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const originExists = planets.some(
            (planet) => planet.name.toLowerCase() === originPlanet.toLowerCase()
        );

        const destinationExists = planets.some(
            (planet) => planet.name.toLowerCase() === originPlanet.toLowerCase()
        );

        if (!originExists && !destinationExists) {
            alert("Origin or destination invalid");
            return;
        }

        if (originPlanet.toLowerCase() === destinationPlanet.toLowerCase()) {
            alert("Origin and destination can not be the same planet");
            return;
        }

        navigateTo(`/search/${originPlanet}/${destinationPlanet}`);
    };

    return (
        <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group controlId="originPlanet">
                <Form.Label>Origin Planet</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter origin planet"
                    list="originPlanets"
                    value={originPlanet}
                    onChange={(event) => setOriginPlanet(event.target.value)}
                    autoComplete="off"
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
                    autoComplete="off"
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

            <Button variant="dark" className="mt-4" type="submit" block>
                Find Route
            </Button>
        </Form>
    );
}

export default RouteForm;

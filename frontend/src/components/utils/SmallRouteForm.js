import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toTitleCase } from "./UtilFunctions";

function SmallRouteForm({ origin, destination }) {
    const [planets, setPlanets] = useState([]);
    const [originPlanet, setOriginPlanet] = useState(origin);
    const [destinationPlanet, setDestinationPlanet] = useState(destination);
    const navigateTo = useNavigate();

    const switchInputs = () => {
        const temp = originPlanet;
        setOriginPlanet(destinationPlanet);
        setDestinationPlanet(temp);
    };

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
        setOriginPlanet(toTitleCase(origin));
        setDestinationPlanet(toTitleCase(destination));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const originExists = planets.some(
            (planet) => planet.name.toLowerCase() === originPlanet.toLowerCase()
        );

        const destinationExists = planets.some(
            (planet) => planet.name.toLowerCase() === destinationPlanet.toLowerCase()
        );

        if (!originExists || !destinationExists) {
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
        <div
            style={{ textAlign: "center", marginTop: "10px" }}
            className="d-flex align-items-center justify-content-center"
        >
            <Form onSubmit={(e) => handleSubmit(e)} className="smaller-form">
                <div className="d-flex align-items-center">
                    <Form.Group controlId="originPlanet" className="mr-2">
                        <Form.Control
                            type="text"
                            placeholder="Origin"
                            list="originPlanets"
                            value={originPlanet}
                            onChange={(event) =>
                                setOriginPlanet(event.target.value)
                            }
                            autoComplete="off"
                        />
                        {planets.length > 0 && (
                            <datalist id="originPlanets">
                                {planets.map(
                                    (planet) =>
                                        originPlanet
                                            .toLowerCase()
                                            .startsWith(
                                                planet.name
                                                    .toLowerCase()
                                                    .charAt(0)
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
                    <div className="text-center">
                        <Button
                            variant="dark"
                            className="switch-button"
                            onClick={switchInputs}
                        >
                            {"<->"}
                        </Button>
                    </div>
                    <Form.Group controlId="destinationPlanet" className="ml-2">
                        <Form.Control
                            type="text"
                            placeholder="Destination"
                            list="destinationPlanets"
                            value={destinationPlanet}
                            onChange={(event) =>
                                setDestinationPlanet(event.target.value)
                            }
                            autoComplete="off"
                        />
                        {planets.length > 0 && (
                            <datalist id="originPlanets">
                                {planets.map(
                                    (planet) =>
                                        originPlanet
                                            .toLowerCase()
                                            .startsWith(
                                                planet.name
                                                    .toLowerCase()
                                                    .charAt(0)
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
                </div>

                <Button variant="dark" className="mt-3" type="submit" block>
                    Find Route
                </Button>
            </Form>
        </div>
    );
}

export default SmallRouteForm;

import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toTitleCase } from "./UtilFunctions";
import { MenuItem, Select } from "@mui/material";

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

        navigateTo(`/search/${originPlanet}/${destinationPlanet}`);
    };

    return (
        <div
            style={{ textAlign: "center", marginTop: "10px" }}
            className="d-flex align-items-center justify-content-center"
        >
            <Form onSubmit={(e) => handleSubmit(e)} className="smaller-form">
                <div className="d-flex align-items-center">
                    <Select
                        style={{
                            width: "200px",
                            margin: "10px",
                            textAlign: "left",
                        }}
                        value={originPlanet}
                        onChange={(event) =>
                            setOriginPlanet(event.target.value)
                        }
                        displayEmpty
                        renderValue={(value) =>
                            value === "" ? "Select origin planet" : value
                        }
                    >
                        {planets.length > 0 &&
                            planets.map(
                                (planet) =>
                                    planet.name !== destinationPlanet && (
                                        <MenuItem
                                            key={planet.id}
                                            value={planet.name}
                                        >
                                            {planet.name}
                                        </MenuItem>
                                    )
                            )}
                    </Select>
                    <div className="text-center">
                        <Button
                            variant="dark"
                            className="switch-button"
                            onClick={switchInputs}
                        >
                            {"<->"}
                        </Button>
                    </div>
                    <Select
                        style={{
                            width: "200px",
                            margin: "10px",
                            textAlign: "left",
                        }}
                        value={destinationPlanet}
                        onChange={(event) =>
                            setDestinationPlanet(event.target.value)
                        }
                        displayEmpty
                        renderValue={(value) =>
                            value === "" ? "Select origin planet" : value
                        }
                    >
                        {planets.length > 0 &&
                            planets.map(
                                (planet) =>
                                    planet.name !== originPlanet && (
                                        <MenuItem
                                            key={planet.id}
                                            value={planet.name}
                                        >
                                            {planet.name}
                                        </MenuItem>
                                    )
                            )}
                    </Select>
                </div>

                <Button variant="dark" className="mt-3" type="submit" block>
                    Find Route
                </Button>
            </Form>
        </div>
    );
}

export default SmallRouteForm;

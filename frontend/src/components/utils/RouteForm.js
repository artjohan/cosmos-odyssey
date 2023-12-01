import { MenuItem, Select } from "@mui/material";
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

        navigateTo(`/search/${originPlanet}/${destinationPlanet}`);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Select
                    style={{
                        width: "500px",
                        margin: "10px",
                        textAlign: "left",
                    }}
                    value={originPlanet}
                    onChange={(event) => setOriginPlanet(event.target.value)}
                    displayEmpty
                    renderValue={(value) =>
                        value === "" ? "Select origin planet" : value
                    }
                >
                    {planets.length &&
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

                <Select
                    style={{
                        width: "500px",
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
                    {planets.length &&
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
                <br></br>

                <Button
                    variant="dark"
                    className="mt-4"
                    type="submit"
                    block
                    disabled={originPlanet && destinationPlanet ? false : true}
                >
                    Find Route
                </Button>
            </Form>
        </div>
    );
}

export default RouteForm;

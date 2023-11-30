import { useEffect, useState } from "react";
import { Route, useParams } from "react-router-dom";
import RouteTable from "../utils/RouteTable";
import { Button } from "react-bootstrap";

function SearchResults() {
    const { origin, destination } = useParams();
    const [directRoutes, setDirectRoutes] = useState([]);
    const [layoverRoutes, setLayoverRoutes] = useState([]);
    const [pricelistExpiration, setPricelistExpiration] = useState(null);

    const [selectedTab, setSelectedTab] = useState("direct");

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const allUniqueProviders = (data) => {
        var providersMap = new Map();
        data.forEach((routeData) => {
            routeData.routes.forEach((route) => {
                providersMap.set(
                    route.providerCompany.id,
                    route.providerCompany
                );
            });
        });

        var uniqueProviders = Array.from(providersMap.values());
        return uniqueProviders;
    };

    const toTitleCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        const getRoutes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-routes?origin=${toTitleCase(
                        origin
                    )}&destination=${toTitleCase(destination)}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setDirectRoutes(
                        data.filter((obj) => obj.routes.length === 1)
                    );
                    setLayoverRoutes(
                        data.filter((obj) => obj.routes.length > 1)
                    );
                    setSelectedTab(
                        data.filter((obj) => obj.routes.length === 1).length
                            ? "direct"
                            : "layover"
                    );
                    setPricelistExpiration(data.pricelistExpiration);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getRoutes();
    }, []);

    if (directRoutes.length > 0 || layoverRoutes.length > 0) {
        return (
            <div style={{ marginTop: "200px" }}>
                <div className="d-flex justify-content-between">
                    <div
                        variant={
                            selectedTab === "direct" ? "contained" : "outlined"
                        }
                        onClick={() => handleTabClick("direct")}
                        className={
                            "tableSelect" +
                            (selectedTab === "direct" ? " selected" : "")
                        }
                    >
                        DIRECT ROUTES
                    </div>
                    <div
                        onClick={() => handleTabClick("layover")}
                        className={
                            "tableSelect" +
                            (selectedTab === "layover" ? " selected" : "")
                        }
                    >
                        LAYOVER ROUTES
                    </div>
                </div>

                {selectedTab === "direct" &&
                    (directRoutes.length > 0 ? (
                        <RouteTable
                            routes={directRoutes}
                            uniqueProviders={allUniqueProviders(
                                directRoutes
                            )}
                            type={`All direct routes from ${toTitleCase(
                                origin
                            )} to ${toTitleCase(destination)}`}
                        />
                    ) : (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "50px",
                                fontSize: "xx-large",
                            }}
                        >
                            There are no direct routes from{" "}
                            {toTitleCase(origin)} to {toTitleCase(destination)}
                        </div>
                    ))}

                {selectedTab === "layover" &&
                    (layoverRoutes.length > 0 ? (
                        <RouteTable
                            routes={layoverRoutes}
                            uniqueProviders={allUniqueProviders(
                                layoverRoutes
                            )}
                            type={`All layover routes from ${toTitleCase(
                                origin
                            )} to ${toTitleCase(destination)}`}
                        />
                    ) : (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "50px",
                                fontSize: "xx-large",
                            }}
                        >
                            There are no layover routes from{" "}
                            {toTitleCase(origin)} to {toTitleCase(destination)}
                        </div>
                    ))}
            </div>
        );
    } else {
        return null;
    }
}
export default SearchResults;

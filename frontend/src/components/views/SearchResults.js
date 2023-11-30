import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RouteTable from "../utils/RouteTable";
import { Nav } from "react-bootstrap";
import SmallRouteForm from "../utils/SmallRouteForm";
import { toTitleCase } from "../utils/UtilFunctions";
import Countdown from "react-countdown";

function SearchResults() {
    const { origin, destination } = useParams();
    const [directRoutes, setDirectRoutes] = useState([]);
    const [layoverRoutes, setLayoverRoutes] = useState([]);
    const [pricelistExpiryDate, setPricelistExpiryDate] = useState(null);
    const [pricelistId, setPricelistId] = useState(null);

    const [selectedTab, setSelectedTab] = useState("direct");

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

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            window.location.reload();
        } else {
            return (
                <>
                    <span>
                        Time left until the pricelist expires and this page
                        refreshes:
                    </span>
                    <br></br>
                    <h1>
                        {minutes}:{seconds < 10 ? "0" : ""}
                        {seconds}
                    </h1>
                </>
            );
        }
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
                        data.routeData.filter((obj) => obj.routes.length === 1)
                    );
                    setLayoverRoutes(
                        data.routeData.filter((obj) => obj.routes.length > 1)
                    );
                    setSelectedTab(
                        data.routeData.filter((obj) => obj.routes.length === 1)
                            .length
                            ? "direct"
                            : "layover"
                    );
                    setPricelistExpiryDate(data.pricelistExpiryDate);
                    setPricelistId(data.pricelistId);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getRoutes();
    }, [origin, destination]);

    if (directRoutes || layoverRoutes) {
        return (
            <>
                <SmallRouteForm origin={origin} destination={destination} />
                {pricelistExpiryDate && (
                    <div style={{ textAlign: "right", marginRight: "20px" }}>
                        <Countdown
                            date={pricelistExpiryDate}
                            renderer={renderer}
                        />
                    </div>
                )}
                <div style={{ marginTop: "20px" }}>
                    <Nav
                        variant="tabs"
                        onSelect={handleTabSelect}
                        activeKey={selectedTab}
                    >
                        <Nav.Item style={{ width: "50%", textAlign: "center" }}>
                            <Nav.Link eventKey="direct">DIRECT ROUTES</Nav.Link>
                        </Nav.Item>
                        <Nav.Item style={{ width: "50%", textAlign: "center" }}>
                            <Nav.Link eventKey="layover">
                                LAYOVER ROUTES
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {selectedTab === "direct" &&
                        (directRoutes.length > 0 ? (
                            <RouteTable
                                routes={directRoutes}
                                pricelistId={pricelistId}
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
                                {toTitleCase(origin)} to{" "}
                                {toTitleCase(destination)}
                            </div>
                        ))}

                    {selectedTab === "layover" &&
                        (layoverRoutes.length > 0 ? (
                            <RouteTable
                                routes={layoverRoutes}
                                pricelistId={pricelistId}
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
                                {toTitleCase(origin)} to{" "}
                                {toTitleCase(destination)}
                            </div>
                        ))}
                </div>
            </>
        );
    } else {
        return null;
    }
}
export default SearchResults;
